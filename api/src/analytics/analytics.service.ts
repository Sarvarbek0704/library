import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { bookState } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalBooks,
      totalUsers,
      totalMembers,
      activeMembers,
      totalPayments,
      monthPayments,
      lastMonthPayments,
      borrowedNow,
      bookedNow,
      overdueCount,
      pendingReturns,
      totalReviews,
      avgRating,
    ] = await Promise.all([
      this.prisma.book.count(),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.member.count(),
      this.prisma.member.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { amount: true },
      }),
      this.prisma.memberState.count({ where: { status: bookState.BORROWED } }),
      this.prisma.memberState.count({ where: { status: bookState.BOOKED } }),
      this.prisma.memberState.count({
        where: { status: bookState.BORROWED, endDate: { lte: now } },
      }),
      this.prisma.returnRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.review.count(),
      this.prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    // Monthly revenue for the last 6 months
    const revenueByMonth: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const agg = await this.prisma.payment.aggregate({
        where: { status: 'SUCCESS', createdAt: { gte: start, lte: end } },
        _sum: { amount: true },
      });
      revenueByMonth.push({
        month: start.toLocaleString('uz-UZ', { month: 'short', year: 'numeric' }),
        revenue: Number(agg._sum.amount ?? 0),
      });
    }

    // Top 10 most borrowed books
    const topBorrowedRaw = await this.prisma.memberState.groupBy({
      by: ['bookId'],
      where: { status: { in: [bookState.BORROWED, bookState.RETURNED] } },
      _count: { bookId: true },
      orderBy: { _count: { bookId: 'desc' } },
      take: 10,
    });

    const topBookIds = topBorrowedRaw.map(r => r.bookId);
    const topBooks = await this.prisma.book.findMany({
      where: { id: { in: topBookIds } },
      select: { id: true, title: true, author: { select: { name: true } } },
    });
    const topBooksMap = new Map(topBooks.map(b => [b.id, b]));

    const topBorrowed = topBorrowedRaw.map(r => ({
      book: topBooksMap.get(r.bookId),
      borrowCount: r._count.bookId,
    }));

    // Top 5 users by score
    const topUsers = await this.prisma.user.findMany({
      where: { role: 'USER', score: { gt: 0 } },
      select: { id: true, firstName: true, lastName: true, score: true, phone: true },
      orderBy: { score: 'desc' },
      take: 5,
    });

    // Membership breakdown
    const membershipBreakdown = await this.prisma.member.groupBy({
      by: ['membershipId'],
      _count: { membershipId: true },
    });
    const membershipIds = membershipBreakdown.map(m => m.membershipId);
    const memberships = await this.prisma.membership.findMany({
      where: { id: { in: membershipIds } },
      select: { id: true, name: true },
    });
    const membershipMap = new Map(memberships.map(m => [m.id, m.name]));

    const membershipStats = membershipBreakdown.map(m => ({
      name: membershipMap.get(m.membershipId) ?? 'Unknown',
      count: m._count.membershipId,
    }));

    // Recent activity (last 10 borrows)
    const recentBorrows = await this.prisma.memberState.findMany({
      where: { status: { in: [bookState.BORROWED, bookState.BOOKED] } },
      include: {
        book: { select: { title: true } },
        member: {
          select: { user: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { startDate: 'desc' },
      take: 10,
    });

    const thisMonthRevenue = Number(monthPayments._sum.amount ?? 0);
    const lastMonthRevenue = Number(lastMonthPayments._sum.amount ?? 0);
    const revenueGrowth =
      lastMonthRevenue === 0
        ? 100
        : Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);

    return {
      overview: {
        totalBooks,
        totalUsers,
        totalMembers,
        activeMembers,
        totalRevenue: Number(totalPayments._sum.amount ?? 0),
        thisMonthRevenue,
        lastMonthRevenue,
        revenueGrowth,
        thisMonthPayments: monthPayments._count,
        borrowedNow,
        bookedNow,
        overdueCount,
        pendingReturns,
        totalReviews,
        avgRating: Number((avgRating._avg.rating ?? 0).toFixed(2)),
      },
      revenueByMonth,
      topBorrowed,
      topUsers,
      membershipStats,
      recentBorrows: recentBorrows.map(r => ({
        id: r.id,
        bookTitle: r.book.title,
        userName: `${r.member.user.firstName} ${r.member.user.lastName ?? ''}`.trim(),
        status: r.status,
        startDate: r.startDate,
        endDate: r.endDate,
      })),
    };
  }

  async getBookStats(bookId: number) {
    const [book, borrowCount, reviewStats, waitlistCount, currentlyBorrowed] = await Promise.all([
      this.prisma.book.findUnique({
        where: { id: bookId },
        include: { author: true, category: true },
      }),
      this.prisma.memberState.count({
        where: { bookId, status: { in: [bookState.BORROWED, bookState.RETURNED] } },
      }),
      this.prisma.review.aggregate({
        where: { bookId },
        _avg: { rating: true },
        _count: true,
      }),
      this.prisma.waitlist.count({ where: { bookId, status: 'WAITING' } }),
      this.prisma.memberState.count({ where: { bookId, status: bookState.BORROWED } }),
    ]);

    return {
      book,
      borrowCount,
      avgRating: Number((reviewStats._avg.rating ?? 0).toFixed(2)),
      reviewCount: reviewStats._count,
      waitlistCount,
      currentlyBorrowed,
    };
  }
}
