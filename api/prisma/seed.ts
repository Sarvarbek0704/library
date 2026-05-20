import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seed boshlandi...');

  // ============================================================
  // 0. Eski ma'lumotlarni tozalash (tartib muhim)
  // ============================================================
  await prisma.returnRequest.deleteMany();
  await prisma.memberState.deleteMany();
  await prisma.bookHistory.deleteMany();
  await prisma.savedBook.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.member.deleteMany();
  await prisma.image.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.category.deleteMany();
  await prisma.library.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Eski ma\'lumotlar tozalandi');

  // ============================================================
  // 1. FOYDALANUVCHILAR
  // ============================================================
  const pass = async (p: string) => bcrypt.hash(p, 10);

  // --- REAL HISOBLAR (maxfiy, faqat portfolio egasi uchun) ---
  const superAdmin = await prisma.user.create({
    data: {
      firstName: 'Sardor',
      lastName: 'Nazarov',
      phone: process.env.SUPER_ADMIN_PHONE!,
      password: await pass(process.env.SUPER_ADMIN_SECRET!),
      role: 'SUPER_ADMIN',
      isActive: true,
      isDemo: false,
      score: 0,
    },
  });

  const realAdmin = await prisma.user.create({
    data: {
      firstName: 'Malika',
      lastName: 'Yusupova',
      phone: process.env.REAL_ADMIN_PHONE || '+998977654321',
      password: await pass(process.env.REAL_ADMIN_SECRET || 'realadmin2026'),
      role: 'ADMIN',
      isActive: true,
      isDemo: false,
      score: 0,
    },
  });

  // --- DEMO HISOBLAR (faqat o'qish, portfolioga tashrif buyuruvchilar uchun) ---
  const demoSuperAdmin = await prisma.user.create({
    data: {
      firstName: 'Demo',
      lastName: 'SuperAdmin',
      phone: '+998900000001',
      password: await pass('demo1234'),
      role: 'SUPER_ADMIN',
      isActive: true,
      isDemo: true,
      score: 0,
    },
  });

  const demoAdmin = await prisma.user.create({
    data: {
      firstName: 'Demo',
      lastName: 'Admin',
      phone: '+998900000002',
      password: await pass('demo1234'),
      role: 'ADMIN',
      isActive: true,
      isDemo: true,
      score: 0,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      firstName: 'Demo',
      lastName: 'User',
      phone: '+998900000003',
      password: await pass('demo1234'),
      role: 'USER',
      isActive: true,
      isDemo: true,
      score: 340,
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: { firstName: 'Zulfiya', lastName: 'Rahimova', phone: '+998901234501', password: await pass('pass123456'), role: 'USER', isActive: true, score: 820 },
    }),
    prisma.user.create({
      data: { firstName: 'Bobur', lastName: 'Aliyev', phone: '+998901234502', password: await pass('pass123456'), role: 'USER', isActive: true, score: 650 },
    }),
    prisma.user.create({
      data: { firstName: 'Nodira', lastName: 'Hasanova', phone: '+998901234503', password: await pass('pass123456'), role: 'USER', isActive: true, score: 510 },
    }),
    prisma.user.create({
      data: { firstName: 'Sherzod', lastName: 'Mirzayev', phone: '+998901234504', password: await pass('pass123456'), role: 'USER', isActive: true, score: 480 },
    }),
    prisma.user.create({
      data: { firstName: 'Dilnoza', lastName: 'Karimova', phone: '+998901234505', password: await pass('pass123456'), role: 'USER', isActive: true, score: 390 },
    }),
    prisma.user.create({
      data: { firstName: 'Ulugbek', lastName: 'Sodiqov', phone: '+998901234506', password: await pass('pass123456'), role: 'USER', isActive: true, score: 275 },
    }),
    prisma.user.create({
      data: { firstName: 'Feruza', lastName: 'Baxtiyorova', phone: '+998901234507', password: await pass('pass123456'), role: 'USER', isActive: true, score: 210 },
    }),
    prisma.user.create({
      data: { firstName: 'Asilbek', lastName: 'Normatov', phone: '+998901234508', password: await pass('pass123456'), role: 'USER', isActive: true, score: 180 },
    }),
    prisma.user.create({
      data: { firstName: 'Shahlo', lastName: 'Ergasheva', phone: '+998901234509', password: await pass('pass123456'), role: 'USER', isActive: true, score: 95 },
    }),
    prisma.user.create({
      data: { firstName: 'Otabek', lastName: 'Yunusov', phone: '+998901234510', password: await pass('pass123456'), role: 'USER', isActive: true, score: 60 },
    }),
  ]);

  const allUsers = [demoUser, ...users];
  console.log(`👥 ${allUsers.length + 3} ta foydalanuvchi yaratildi`);

  // ============================================================
  // 2. KUTUBXONALAR
  // ============================================================
  const libraries = await Promise.all([
    prisma.library.create({
      data: {
        name: 'Alisher Navoiy nomidagi Milliy kutubxona',
        contact: '+998712339933',
        address: 'Toshkent shahar, Navoiy ko\'chasi, 1-uy',
        location: 'Toshkent, O\'zbekiston',
        lat: 41.2995,
        lon: 69.2401,
      },
    }),
    prisma.library.create({
      data: {
        name: 'Mirzo Ulug\'bek nomidagi kutubxona',
        contact: '+998712456789',
        address: 'Toshkent shahar, Universitet ko\'chasi, 4-uy',
        location: 'Toshkent, O\'zbekiston',
        lat: 41.3425,
        lon: 69.2871,
      },
    }),
    prisma.library.create({
      data: {
        name: 'Samarqand viloyat kutubxonasi',
        contact: '+998662351090',
        address: 'Samarqand shahar, Registon ko\'chasi, 12-uy',
        location: 'Samarqand, O\'zbekiston',
        lat: 39.6543,
        lon: 66.9597,
      },
    }),
    prisma.library.create({
      data: {
        name: 'Buxoro viloyat kutubxonasi',
        contact: '+998652244010',
        address: 'Buxoro shahar, Lyabi-Hovuz ko\'chasi, 5-uy',
        location: 'Buxoro, O\'zbekiston',
        lat: 39.7747,
        lon: 64.4286,
      },
    }),
    prisma.library.create({
      data: {
        name: 'Andijon shahar markaziy kutubxonasi',
        contact: '+998742225566',
        address: 'Andijon shahar, Mustaqillik maydoni, 3-uy',
        location: 'Andijon, O\'zbekiston',
        lat: 40.7821,
        lon: 72.3442,
      },
    }),
  ]);
  console.log(`🏛️  ${libraries.length} ta kutubxona yaratildi`);

  // ============================================================
  // 3. KATEGORIYALAR
  // ============================================================
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Badiiy adabiyot', desc: 'Romanlar, qissalar, hikoyalar va she\'rlar' } }),
    prisma.category.create({ data: { name: 'Ilmiy-ommabop', desc: 'Fan va texnologiyalar haqida ommabop kitoblar' } }),
    prisma.category.create({ data: { name: 'Tarix', desc: 'O\'zbekiston va jahon tarixi' } }),
    prisma.category.create({ data: { name: 'Falsafa', desc: 'Falsafiy asarlar va dunyoqarash' } }),
    prisma.category.create({ data: { name: 'Psixologiya', desc: 'Insoniy xulq-atvor va ruhiyat' } }),
    prisma.category.create({ data: { name: 'Biznes va iqtisodiyot', desc: 'Tadbirkorlik, marketing va moliya' } }),
    prisma.category.create({ data: { name: 'Dasturlash', desc: 'IT va dasturiy ta\'minot' } }),
    prisma.category.create({ data: { name: 'Bolalar adabiyoti', desc: 'Ertaklar va bolalar uchun kitoblar' } }),
    prisma.category.create({ data: { name: 'Klassik adabiyot', desc: 'Jahon klassik adabiyoti' } }),
    prisma.category.create({ data: { name: 'Tibbiyot va sog\'liq', desc: 'Sog\'lom turmush tarzi va tibbiyot' } }),
    prisma.category.create({ data: { name: 'Din va ma\'naviyat', desc: 'Islom dini, tasavvuf va ma\'naviy rivojlanish' } }),
    prisma.category.create({ data: { name: 'Geografiya va sayohat', desc: 'Sayohat va dunyo geografiyasi' } }),
  ]);
  console.log(`📚 ${categories.length} ta kategoriya yaratildi`);

  // ============================================================
  // 4. MUALLIFLAR
  // ============================================================
  const authors = await Promise.all([
    prisma.author.create({ data: { name: 'Alisher Navoiy', desc: 'O\'zbek mumtoz adabiyotining buyuk vakili, shoir va mutafakkir (1441–1501)' } }),
    prisma.author.create({ data: { name: 'Abdulla Qodiriy', desc: 'O\'zbek romannavisligining otasi. "O\'tgan kunlar" romani muallifi (1894–1938)' } }),
    prisma.author.create({ data: { name: 'Oybek', desc: 'O\'zbek sovet adabiyotining yirik vakili, "Qutlug\' qon" romani muallifi (1905–1968)' } }),
    prisma.author.create({ data: { name: 'G\'afur G\'ulom', desc: 'O\'zbek shoiri va yozuvchisi, "Shum bola" asari muallifi (1903–1966)' } }),
    prisma.author.create({ data: { name: 'Said Ahmad', desc: 'O\'zbek yozuvchisi, "Ufq" romani muallifi (1920–2007)' } }),
    prisma.author.create({ data: { name: 'Erkin Vohidov', desc: 'O\'zbekistonning xalq shoiri (1936–2016)' } }),
    prisma.author.create({ data: { name: 'Abdulla Oripov', desc: 'O\'zbekistonning xalq shoiri, milliy madhiya muallifi (1941–2016)' } }),
    prisma.author.create({ data: { name: 'Tog\'ay Murod', desc: 'O\'zbek yozuvchisi, "Otamdan qolgan dalalar" muallifi (1948–2003)' } }),
    prisma.author.create({ data: { name: 'Ulmas Umarbekov', desc: 'O\'zbek nasrnavis yozuvchisi va dramaturg (1935–2004)' } }),
    prisma.author.create({ data: { name: 'Xurshid Do\'stmuhammad', desc: 'Zamonaviy o\'zbek yozuvchisi va tarjimon (1958–hozir)' } }),
    prisma.author.create({ data: { name: 'Leo Tolstoy', desc: 'Rus klassik adabiyotining buyuk vakili (1828–1910)' } }),
    prisma.author.create({ data: { name: 'Fyodor Dostoyevskiy', desc: 'Rus adibi, psixologik romanlar ustasi (1821–1881)' } }),
    prisma.author.create({ data: { name: 'Gabriel Garsia Markes', desc: 'Kolumbiyalik yozuvchi, "Yuz yillik yolg\'izlik" muallifi (1927–2014)' } }),
    prisma.author.create({ data: { name: 'Ernest Xeminguey', desc: 'Amerikalik yozuvchi va Nobel mukofoti sovrindori (1899–1961)' } }),
    prisma.author.create({ data: { name: 'Dale Carnegie', desc: 'Amerikalik muallif va motivatsion notiq (1888–1955)' } }),
    prisma.author.create({ data: { name: 'Robert Kiyosaki', desc: 'Amerikalik biznesmen va "Boy ota, kambag\'al ota" muallifi (1947–hozir)' } }),
    prisma.author.create({ data: { name: 'Yuval Noa Xarari', desc: 'Isroillik tarixchi va "Sapiens" muallifi (1976–hozir)' } }),
    prisma.author.create({ data: { name: 'Imam al-Buxoriy', desc: 'Buyuk muhaddis olim, "Sahih al-Buxoriy" muallifi (810–870)' } }),
    prisma.author.create({ data: { name: 'Abu Ali ibn Sino', desc: 'Buyuk alloma, tabib va faylasuf (980–1037)' } }),
    prisma.author.create({ data: { name: 'Mirzo Ulug\'bek', desc: 'O\'zbek astronomu va matematigi, Temuriylar sulolasidan (1394–1449)' } }),
  ]);
  console.log(`✍️  ${authors.length} ta muallif yaratildi`);

  // ============================================================
  // 5. KITOBLAR
  // ============================================================
  type BookData = {
    libraryId: number; categoryId: number; authorId: number;
    title: string; status: any; quantity: number;
    description: string; pages: number;
  };

  const bookData: BookData[] = [
    // Badiiy adabiyot (cat[0])
    { libraryId: libraries[0].id, categoryId: categories[0].id, authorId: authors[1].id, title: 'O\'tgan kunlar', status: 'AVAILABLE', quantity: 8, description: 'O\'zbek adabiyotining birinchi klassik romani. XIX asr Toshkentida bir sevgi va fojia hikoyasi.', pages: 412 },
    { libraryId: libraries[0].id, categoryId: categories[0].id, authorId: authors[1].id, title: 'Mehrobdan chayon', status: 'AVAILABLE', quantity: 6, description: 'Abdulla Qodiriyning ikkinchi mashhur romani. Iqbol va sevgi mavzusida.', pages: 386 },
    { libraryId: libraries[1].id, categoryId: categories[0].id, authorId: authors[2].id, title: 'Qutlug\' qon', status: 'AVAILABLE', quantity: 5, description: 'Oybek qalamiga mansub tarixiy roman. 1916-yil qo\'zg\'oloni tasvirlanadi.', pages: 520 },
    { libraryId: libraries[1].id, categoryId: categories[0].id, authorId: authors[3].id, title: 'Shum bola', status: 'AVAILABLE', quantity: 10, description: 'G\'afur G\'ulomning o\'z bolaliklaridan ilhomlanib yozilgan yumoristik asari.', pages: 248 },
    { libraryId: libraries[2].id, categoryId: categories[0].id, authorId: authors[7].id, title: 'Otamdan qolgan dalalar', status: 'AVAILABLE', quantity: 4, description: 'Tog\'ay Murodning eng mashhur asari. Ona yurt va tabiat sevgisi haqida.', pages: 304 },
    { libraryId: libraries[2].id, categoryId: categories[0].id, authorId: authors[4].id, title: 'Ufq', status: 'AVAILABLE', quantity: 3, description: 'Said Ahmadning ko\'p jildli romani. Zamonaviy O\'zbekiston hayotini tasvirlaydi.', pages: 640 },

    // Klassik adabiyot (cat[8])
    { libraryId: libraries[0].id, categoryId: categories[8].id, authorId: authors[10].id, title: 'Urush va tinchlik', status: 'AVAILABLE', quantity: 5, description: 'Leo Tolstoyning 4 jildli epik romani. Napoleyon urushlarini tasvirlaydi.', pages: 1456 },
    { libraryId: libraries[0].id, categoryId: categories[8].id, authorId: authors[10].id, title: 'Anna Karenina', status: 'AVAILABLE', quantity: 7, description: 'Tolstoyning sevgi, nikoh va jamiyat haqidagi mashhur romani.', pages: 864 },
    { libraryId: libraries[1].id, categoryId: categories[8].id, authorId: authors[11].id, title: 'Jinoyat va jazo', status: 'AVAILABLE', quantity: 6, description: 'Dostoyevskiyning psixologik masterklasi. Bir student jinoyatini o\'rganadi.', pages: 672 },
    { libraryId: libraries[1].id, categoryId: categories[8].id, authorId: authors[11].id, title: 'Idiot', status: 'AVAILABLE', quantity: 4, description: 'Dostoyevskiyning ulug\' romani. Sof qalbli insonning fojiali taqdiri.', pages: 624 },
    { libraryId: libraries[2].id, categoryId: categories[8].id, authorId: authors[12].id, title: 'Yuz yillik yolg\'izlik', status: 'AVAILABLE', quantity: 5, description: 'Markes yaratgan sehrli realizm durdonasi. Buendia oilasining yetti avlodi hikoyasi.', pages: 448 },
    { libraryId: libraries[3].id, categoryId: categories[8].id, authorId: authors[13].id, title: 'Quyosh ham chiqadi', status: 'AVAILABLE', quantity: 3, description: 'Xemingueyning "Yo\'qotilgan avlod" haqidagi birinchi romani.', pages: 251 },

    // Mumtoz o'zbek adabiyoti (cat[0] + authors[0])
    { libraryId: libraries[0].id, categoryId: categories[0].id, authorId: authors[0].id, title: 'Xamsa', status: 'AVAILABLE', quantity: 4, description: 'Alisher Navoiyning besh dostondan iborat ulkan asari. Umumbashariy muammolarga bag\'ishlangan.', pages: 1280 },
    { libraryId: libraries[0].id, categoryId: categories[0].id, authorId: authors[0].id, title: 'Mahbub ul-qulub', status: 'AVAILABLE', quantity: 3, description: 'Navoiyning inson va jamiyat haqidagi nasriy asari.', pages: 196 },
    { libraryId: libraries[3].id, categoryId: categories[0].id, authorId: authors[0].id, title: 'Lison ut-tayr', status: 'AVAILABLE', quantity: 2, description: 'Navoiyning tasavvufiy-allegorik dostoni.', pages: 312 },

    // Psixologiya (cat[4])
    { libraryId: libraries[0].id, categoryId: categories[4].id, authorId: authors[14].id, title: 'Do\'stlar orttirish va odamlarga ta\'sir etish', status: 'AVAILABLE', quantity: 12, description: 'Dale Carnegining kommunikatsiya va muloqot haqidagi mashhur kitobi.', pages: 288 },
    { libraryId: libraries[1].id, categoryId: categories[4].id, authorId: authors[14].id, title: 'Xavotirlanmang, yashang!', status: 'AVAILABLE', quantity: 9, description: 'Carnegining stress va tashvishlarni yengish haqidagi kitobi.', pages: 320 },
    { libraryId: libraries[2].id, categoryId: categories[4].id, authorId: authors[14].id, title: 'Lider bo\'lish sirlari', status: 'AVAILABLE', quantity: 7, description: 'Carnegining yetakchilik va nufuz qozonish haqida amaliy qo\'llanmasi.', pages: 256 },

    // Biznes (cat[5])
    { libraryId: libraries[0].id, categoryId: categories[5].id, authorId: authors[15].id, title: 'Boy ota, kambag\'al ota', status: 'AVAILABLE', quantity: 15, description: 'Moliyaviy savodxonlik va boylik yaratish haqida dunyoga mashhur kitob.', pages: 336 },
    { libraryId: libraries[1].id, categoryId: categories[5].id, authorId: authors[15].id, title: 'Kesh-flo o\'yini', status: 'AVAILABLE', quantity: 6, description: 'Kiyosakining investitsiya va moliyaviy erkinlik haqidagi kitobi.', pages: 298 },
    { libraryId: libraries[4].id, categoryId: categories[5].id, authorId: authors[14].id, title: 'Muvaffaqiyatga erishish yo\'llari', status: 'AVAILABLE', quantity: 8, description: 'Zamonaviy biznes va shaxsiy muvaffaqiyat haqidagi qo\'llanma.', pages: 272 },

    // Tarix (cat[2])
    { libraryId: libraries[0].id, categoryId: categories[2].id, authorId: authors[16].id, title: 'Sapiens: Insoniyat tarixi', status: 'AVAILABLE', quantity: 10, description: 'Yuval Xararining insoniyat tarixini yangicha talqin etuvchi mashhur asari.', pages: 512 },
    { libraryId: libraries[1].id, categoryId: categories[2].id, authorId: authors[16].id, title: 'Homo Deus: Ertangi kun tarixi', status: 'AVAILABLE', quantity: 7, description: 'Xararining kelajak va sun\'iy intellekt haqidagi bashoratli kitobi.', pages: 464 },
    { libraryId: libraries[2].id, categoryId: categories[2].id, authorId: authors[19].id, title: 'Ulug\'bek va uning davri', status: 'AVAILABLE', quantity: 4, description: 'Mirzo Ulug\'bek hayoti va ilmiy merosiga bag\'ishlangan tarixiy asar.', pages: 342 },
    { libraryId: libraries[3].id, categoryId: categories[2].id, authorId: authors[18].id, title: 'O\'rta Osiyo tarixi', status: 'AVAILABLE', quantity: 5, description: 'O\'rta Osiyo xalqlari tarixi va madaniyati haqida keng qamrovli asar.', pages: 780 },

    // Dasturlash (cat[6])
    { libraryId: libraries[0].id, categoryId: categories[6].id, authorId: authors[9].id, title: 'Python dasturlash asoslari', status: 'AVAILABLE', quantity: 8, description: 'Python tilini noldan o\'rganish uchun to\'liq qo\'llanma.', pages: 560 },
    { libraryId: libraries[1].id, categoryId: categories[6].id, authorId: authors[9].id, title: 'Veb-dasturlash: HTML, CSS, JavaScript', status: 'AVAILABLE', quantity: 6, description: 'Zamonaviy veb-texnologiyalarini o\'rgatuvchi kurs kitobi.', pages: 640 },
    { libraryId: libraries[4].id, categoryId: categories[6].id, authorId: authors[9].id, title: 'Ma\'lumotlar tuzilmasi va algoritmlar', status: 'AVAILABLE', quantity: 4, description: 'Dasturlashda asosiy algoritmlar va ma\'lumotlar tuzilmasi.', pages: 488 },

    // Din va ma'naviyat (cat[10])
    { libraryId: libraries[0].id, categoryId: categories[10].id, authorId: authors[17].id, title: 'Al-Adab al-Mufrad', status: 'AVAILABLE', quantity: 5, description: 'Imom Buxoriyning odob-axloq haqidagi hadislar to\'plami.', pages: 384 },
    { libraryId: libraries[3].id, categoryId: categories[10].id, authorId: authors[18].id, title: 'Tib qonunlari', status: 'AVAILABLE', quantity: 3, description: 'Ibn Sinoning tibbiyot sohasidagi ulkan ensiklopediyasi.', pages: 1120 },
    { libraryId: libraries[2].id, categoryId: categories[10].id, authorId: authors[0].id, title: 'Nasoyim ul-muhabbat', status: 'AVAILABLE', quantity: 4, description: 'Navoiyning 770 sufiy olimlar tarjimai holini o\'z ichiga olgan asari.', pages: 520 },

    // Ilmiy-ommabop (cat[1])
    { libraryId: libraries[0].id, categoryId: categories[1].id, authorId: authors[18].id, title: 'Kitob ul-Qonun fit-Tib', status: 'AVAILABLE', quantity: 3, description: 'Ibn Sinoning tibbiyotga oid asosiy asari. Qadimiy tibbiy bilimlar xazinasi.', pages: 984 },
    { libraryId: libraries[1].id, categoryId: categories[1].id, authorId: authors[16].id, title: '21 asr uchun 21 dars', status: 'AVAILABLE', quantity: 8, description: 'Xararining zamonaviy dunyodagi asosiy muammolar haqidagi kitobi.', pages: 372 },

    // Bolalar adabiyoti (cat[7])
    { libraryId: libraries[0].id, categoryId: categories[7].id, authorId: authors[3].id, title: 'Sanchilova', status: 'AVAILABLE', quantity: 15, description: 'G\'afur G\'ulomning bolalar uchun yozilgan qiziqarli hikoyalari to\'plami.', pages: 164 },
    { libraryId: libraries[4].id, categoryId: categories[7].id, authorId: authors[5].id, title: 'Yor-yor', status: 'AVAILABLE', quantity: 12, description: 'Erkin Vohidovning bolalar uchun she\'rlar to\'plami.', pages: 128 },
    { libraryId: libraries[3].id, categoryId: categories[7].id, authorId: authors[6].id, title: 'Tog\'lar qo\'shig\'i', status: 'AVAILABLE', quantity: 10, description: 'Abdulla Oripovning bolalar uchun she\'rlari.', pages: 144 },

    // Falsafa (cat[3])
    { libraryId: libraries[0].id, categoryId: categories[3].id, authorId: authors[18].id, title: 'Mantiq ilmi', status: 'AVAILABLE', quantity: 3, description: 'Ibn Sinoning falsafa va mantiq haqidagi asarlari to\'plami.', pages: 456 },
    { libraryId: libraries[1].id, categoryId: categories[3].id, authorId: authors[0].id, title: 'Muhokamat ul-lug\'atayn', status: 'AVAILABLE', quantity: 4, description: 'Navoiyning o\'zbek va fors tillarini qiyosiy o\'rganishga bag\'ishlangan asari.', pages: 168 },

    // Geografiya (cat[11])
    { libraryId: libraries[2].id, categoryId: categories[11].id, authorId: authors[9].id, title: 'O\'zbekistonning tabiiy boyliklari', status: 'AVAILABLE', quantity: 6, description: 'O\'zbekiston geografiyasi, iqlimi va tabiiy resurslari haqida to\'liq ma\'lumotnoma.', pages: 428 },
    { libraryId: libraries[4].id, categoryId: categories[11].id, authorId: authors[9].id, title: 'Markaziy Osiyo: Ipak yo\'li', status: 'AVAILABLE', quantity: 5, description: 'Buyuk Ipak yo\'li bo\'ylab Markaziy Osiyo shaharlari tarixi va geografiyasi.', pages: 352 },

    // Tibbiyot (cat[9])
    { libraryId: libraries[0].id, categoryId: categories[9].id, authorId: authors[18].id, title: 'Sog\'lom turmush tarzi', status: 'AVAILABLE', quantity: 9, description: 'Ibn Sino asarlari asosida tayyorlangan sog\'liqni saqlash qo\'llanmasi.', pages: 286 },
    { libraryId: libraries[3].id, categoryId: categories[9].id, authorId: authors[9].id, title: 'Zamonaviy tibbiyot va profilaktika', status: 'AVAILABLE', quantity: 7, description: 'Zamonaviy tibbiy bilimlar va kasalliklarning oldini olish usullari.', pages: 318 },

    // Qo'shimcha roman va she'rlar
    { libraryId: libraries[1].id, categoryId: categories[0].id, authorId: authors[5].id, title: 'Ruboiylar', status: 'AVAILABLE', quantity: 6, description: 'Erkin Vohidovning to\'rtlik she\'rlari to\'plami.', pages: 192 },
    { libraryId: libraries[2].id, categoryId: categories[0].id, authorId: authors[6].id, title: 'O\'zbegim', status: 'AVAILABLE', quantity: 7, description: 'Abdulla Oripovning lirik she\'rlari to\'plami.', pages: 216 },
    { libraryId: libraries[0].id, categoryId: categories[0].id, authorId: authors[8].id, title: 'Oqqushlar o\'lmasin', status: 'AVAILABLE', quantity: 5, description: 'Ulmas Umarbekovning hayot va sevgi haqidagi qissasi.', pages: 268 },
    { libraryId: libraries[4].id, categoryId: categories[0].id, authorId: authors[9].id, title: 'Daftar hoshiyasidagi bitiklar', status: 'AVAILABLE', quantity: 4, description: 'Xurshid Do\'stmuhammadning zamonaviy o\'zbek nasri namunasi.', pages: 336 },
    { libraryId: libraries[3].id, categoryId: categories[5].id, authorId: authors[15].id, title: 'Investitsiya asoslari', status: 'AVAILABLE', quantity: 5, description: 'Birja va investitsiya bozorida ishlashni o\'rgatuvchi amaliy qo\'llanma.', pages: 264 },
    { libraryId: libraries[1].id, categoryId: categories[2].id, authorId: authors[19].id, title: 'Temur tuzuklari', status: 'AVAILABLE', quantity: 6, description: 'Sohibqiron Amir Temur tomonidan yozilgan qonunlar va boshqaruv tamoyillari.', pages: 248 },
    { libraryId: libraries[4].id, categoryId: categories[3].id, authorId: authors[18].id, title: 'Risolai nafs', status: 'AVAILABLE', quantity: 3, description: 'Ibn Sinoning inson ruhi va uning mohiyati haqidagi falsafiy risolasi.', pages: 198 },
    { libraryId: libraries[0].id, categoryId: categories[1].id, authorId: authors[19].id, title: 'Ziyj Ko\'ragonsiy', status: 'AVAILABLE', quantity: 2, description: 'Mirzo Ulug\'bekning astronomik jadvallari va yulduzlar katalogi.', pages: 420 },
    { libraryId: libraries[2].id, categoryId: categories[6].id, authorId: authors[9].id, title: 'Sun\'iy intellekt va kelajak', status: 'AVAILABLE', quantity: 5, description: 'Zamonaviy AI texnologiyalari va ularning jamiyatga ta\'siri haqida.', pages: 392 },
    { libraryId: libraries[3].id, categoryId: categories[4].id, authorId: authors[9].id, title: 'Emotsional intellekt', status: 'AVAILABLE', quantity: 8, description: 'His-tuyg\'ularni boshqarish va emotsional zukkolik haqida amaliy qo\'llanma.', pages: 304 },
  ];

  const books = await Promise.all(
    bookData.map((b) => prisma.book.create({ data: b }))
  );
  console.log(`📖 ${books.length} ta kitob yaratildi`);

  // ============================================================
  // 6. OBUNALAR (MEMBERSHIP)
  // ============================================================
  const memberships = await Promise.all([
    prisma.membership.create({
      data: {
        name: 'ELITE',
        price: 500000,
        durationDays: 30,
        description: 'Elite obuna: oylik. 5 ta bron + 5 ta kitob olish imkoniyati. Barcha kutubxonalarga kirish.',
        limitBook: 5,
        limitBorrow: 5,
      },
    }),
    prisma.membership.create({
      data: {
        name: 'PRO',
        price: 250000,
        durationDays: 30,
        description: 'Pro obuna: oylik. 3 ta bron + 3 ta kitob olish imkoniyati.',
        limitBook: 3,
        limitBorrow: 3,
      },
    }),
    prisma.membership.create({
      data: {
        name: 'PREMIUM',
        price: 100000,
        durationDays: 30,
        description: 'Premium obuna: oylik. 1 ta bron + 2 ta kitob olish imkoniyati.',
        limitBook: 1,
        limitBorrow: 2,
      },
    }),
  ]);
  console.log(`💎 ${memberships.length} ta obuna yaratildi`);

  // ============================================================
  // 7. TO'LOVLAR VA A'ZOLIKLAR
  // ============================================================
  const membershipEndDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const pastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  // Demo user — PRO obuna
  await prisma.payment.create({
    data: { userId: demoUser.id, membershipId: memberships[1].id, method: 'CARD', amount: 250000, status: 'SUCCESS', paidAt: new Date() },
  });
  const demoMember = await prisma.member.create({
    data: { userId: demoUser.id, membershipId: memberships[1].id, startDate: new Date(), endDate: membershipEndDate(30), status: 'ACTIVE', isPaid: true },
  });

  // 10 ta user uchun to'lov + a'zolik
  const memberData = [
    { user: users[0], membership: memberships[0], method: 'CARD' as any },   // ELITE
    { user: users[1], membership: memberships[1], method: 'CASH' as any },   // PRO
    { user: users[2], membership: memberships[2], method: 'ONLINE' as any }, // PREMIUM
    { user: users[3], membership: memberships[0], method: 'CARD' as any },   // ELITE
    { user: users[4], membership: memberships[1], method: 'CASH' as any },   // PRO
    { user: users[5], membership: memberships[2], method: 'CARD' as any },   // PREMIUM
    { user: users[6], membership: memberships[1], method: 'ONLINE' as any }, // PRO
    { user: users[7], membership: memberships[0], method: 'CASH' as any },   // ELITE
    { user: users[8], membership: memberships[2], method: 'CARD' as any },   // PREMIUM
    { user: users[9], membership: memberships[1], method: 'ONLINE' as any }, // PRO
  ];

  const members: any[] = [demoMember];
  for (const { user, membership, method } of memberData) {
    await prisma.payment.create({
      data: { userId: user.id, membershipId: membership.id, method, amount: membership.price, status: 'SUCCESS', paidAt: pastDate(Math.floor(Math.random() * 20) + 1) },
    });
    const m = await prisma.member.create({
      data: { userId: user.id, membershipId: membership.id, startDate: pastDate(10), endDate: membershipEndDate(20), status: 'ACTIVE', isPaid: true },
    });
    members.push(m);
  }

  // Ba'zi o'tgan obunalar (NOTACTIVE)
  for (let i = 0; i < 3; i++) {
    const u = users[i];
    const ms = memberships[i % 3];
    await prisma.payment.create({
      data: { userId: u.id, membershipId: ms.id, method: 'CASH', amount: ms.price, status: 'SUCCESS', paidAt: pastDate(45) },
    });
    await prisma.member.create({
      data: { userId: u.id, membershipId: ms.id, startDate: pastDate(45), endDate: pastDate(15), status: 'NOTACTIVE', isPaid: true },
    });
  }

  // Muvaffaqiyatsiz to'lov
  await prisma.payment.create({
    data: { userId: users[4].id, membershipId: memberships[0].id, method: 'ONLINE', amount: 500000, status: 'FAILED', paidAt: null },
  });

  console.log(`💳 To'lovlar va a'zoliklar yaratildi`);

  // ============================================================
  // 8. KITOB HOLATLARI (MEMBERSTATE — olingan/bron qilingan)
  // ============================================================
  // Demo user — 2 ta kitob olingan
  const borrowEndDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  await prisma.memberState.create({
    data: { memberId: demoMember.id, bookId: books[0].id, startDate: pastDate(5), endDate: borrowEndDate(15), status: 'BORROWED' },
  });
  await prisma.book.update({ where: { id: books[0].id }, data: { quantity: books[0].quantity - 1 } });

  await prisma.memberState.create({
    data: { memberId: demoMember.id, bookId: books[15].id, startDate: new Date(), endDate: borrowEndDate(1), status: 'BOOKED' },
  });
  await prisma.book.update({ where: { id: books[15].id }, data: { quantity: books[15].quantity - 1 } });

  // Boshqa a'zolar uchun turli holatlar
  const stateConfigs = [
    { memberIdx: 1, bookIdx: 6,  status: 'BORROWED', startDaysAgo: 3,  endDaysLater: 17 },
    { memberIdx: 1, bookIdx: 20, status: 'BOOKED',   startDaysAgo: 0,  endDaysLater: 1  },
    { memberIdx: 2, bookIdx: 8,  status: 'BORROWED', startDaysAgo: 10, endDaysLater: 10 },
    { memberIdx: 3, bookIdx: 12, status: 'BORROWED', startDaysAgo: 2,  endDaysLater: 18 },
    { memberIdx: 3, bookIdx: 22, status: 'BORROWED', startDaysAgo: 7,  endDaysLater: 13 },
    { memberIdx: 4, bookIdx: 16, status: 'BOOKED',   startDaysAgo: 0,  endDaysLater: 1  },
    { memberIdx: 5, bookIdx: 7,  status: 'BORROWED', startDaysAgo: 4,  endDaysLater: 16 },
    { memberIdx: 6, bookIdx: 19, status: 'BORROWED', startDaysAgo: 8,  endDaysLater: 12 },
    { memberIdx: 7, bookIdx: 24, status: 'BORROWED', startDaysAgo: 1,  endDaysLater: 19 },
    { memberIdx: 7, bookIdx: 31, status: 'BOOKED',   startDaysAgo: 0,  endDaysLater: 1  },
    { memberIdx: 8, bookIdx: 9,  status: 'BORROWED', startDaysAgo: 6,  endDaysLater: 14 },
    { memberIdx: 9, bookIdx: 27, status: 'BORROWED', startDaysAgo: 2,  endDaysLater: 18 },
    { memberIdx: 10, bookIdx: 13, status: 'BORROWED', startDaysAgo: 5, endDaysLater: 15 },
  ];

  for (const cfg of stateConfigs) {
    const member = members[cfg.memberIdx];
    const book = books[cfg.bookIdx];
    if (!member || !book) continue;
    await prisma.memberState.create({
      data: {
        memberId: member.id,
        bookId: book.id,
        startDate: pastDate(cfg.startDaysAgo),
        endDate: borrowEndDate(cfg.endDaysLater),
        status: cfg.status as any,
      },
    });
    await prisma.book.update({ where: { id: book.id }, data: { quantity: { decrement: 1 } } });
  }

  // Qaytarilgan kitoblar (RETURNED)
  const returnedConfigs = [
    { memberIdx: 1, bookIdx: 2,  score: Math.floor(books[2].pages / 50) },
    { memberIdx: 2, bookIdx: 4,  score: Math.floor(books[4].pages / 50) },
    { memberIdx: 3, bookIdx: 10, score: Math.floor(books[10].pages / 50) },
    { memberIdx: 4, bookIdx: 18, score: Math.floor(books[18].pages / 50) },
    { memberIdx: 5, bookIdx: 21, score: Math.floor(books[21].pages / 50) },
    { memberIdx: 6, bookIdx: 25, score: Math.floor(books[25].pages / 50) },
    { memberIdx: 0, bookIdx: 3,  score: Math.floor(books[3].pages / 50) },  // demo user
  ];

  for (const cfg of returnedConfigs) {
    const member = members[cfg.memberIdx];
    const book = books[cfg.bookIdx];
    if (!member || !book) continue;
    await prisma.memberState.create({
      data: {
        memberId: member.id,
        bookId: book.id,
        startDate: pastDate(25),
        endDate: pastDate(5),
        status: 'RETURNED',
      },
    });
  }

  console.log(`📋 Kitob holatlari yaratildi`);

  // ============================================================
  // 9. QAYTARISH SO'ROVLARI (RETURN REQUEST)
  // ============================================================
  // Pending so'rovlar
  await prisma.returnRequest.create({
    data: { memberId: demoMember.id, bookId: books[0].id, status: 'PENDING' },
  });
  await prisma.returnRequest.create({
    data: { memberId: members[1].id, bookId: books[6].id, status: 'PENDING' },
  });
  await prisma.returnRequest.create({
    data: { memberId: members[2].id, bookId: books[8].id, status: 'PENDING' },
  });
  await prisma.returnRequest.create({
    data: { memberId: members[5].id, bookId: books[7].id, status: 'PENDING' },
  });

  // Tasdiqlangan so'rovlar
  await prisma.returnRequest.create({
    data: { memberId: members[1].id, bookId: books[2].id, status: 'ACCEPTED', note: 'Kitob yaxshi holatda qaytarildi', decidedAt: pastDate(5) },
  });
  await prisma.returnRequest.create({
    data: { memberId: members[2].id, bookId: books[4].id, status: 'ACCEPTED', note: 'Qabul qilindi', decidedAt: pastDate(3) },
  });
  await prisma.returnRequest.create({
    data: { memberId: members[4].id, bookId: books[18].id, status: 'ACCEPTED', note: 'Tasdiqlandi', decidedAt: pastDate(7) },
  });

  // Rad etilgan so'rovlar
  await prisma.returnRequest.create({
    data: { memberId: members[3].id, bookId: books[10].id, status: 'REJECTED', note: 'Kitob shikastlangan, tekshirish zarur', decidedAt: pastDate(2) },
  });
  await prisma.returnRequest.create({
    data: { memberId: members[6].id, bookId: books[25].id, status: 'REJECTED', note: 'Noto\'g\'ri kitob ko\'rsatildi', decidedAt: pastDate(1) },
  });

  console.log(`📬 Qaytarish so\'rovlari yaratildi`);

  // ============================================================
  // 10. SAQLANGAN KITOBLAR (SAVED BOOKS)
  // ============================================================
  const savedBooksData = [
    { userId: demoUser.id, bookId: books[1].id },
    { userId: demoUser.id, bookId: books[6].id },
    { userId: demoUser.id, bookId: books[20].id },
    { userId: users[0].id, bookId: books[0].id },
    { userId: users[0].id, bookId: books[12].id },
    { userId: users[0].id, bookId: books[8].id },
    { userId: users[1].id, bookId: books[16].id },
    { userId: users[1].id, bookId: books[19].id },
    { userId: users[2].id, bookId: books[7].id },
    { userId: users[2].id, bookId: books[22].id },
    { userId: users[3].id, bookId: books[11].id },
    { userId: users[3].id, bookId: books[24].id },
    { userId: users[4].id, bookId: books[15].id },
    { userId: users[5].id, bookId: books[3].id },
    { userId: users[5].id, bookId: books[28].id },
    { userId: users[6].id, bookId: books[17].id },
    { userId: users[7].id, bookId: books[14].id },
    { userId: users[7].id, bookId: books[30].id },
    { userId: users[8].id, bookId: books[9].id },
    { userId: users[9].id, bookId: books[26].id },
    { userId: users[9].id, bookId: books[33].id },
  ];

  for (const sb of savedBooksData) {
    await prisma.savedBook.create({ data: sb }).catch(() => {});
  }
  console.log(`❤️  Saqlangan kitoblar yaratildi`);

  // ============================================================
  // 11. KITOB TARIXI (BOOK HISTORY)
  // ============================================================
  const historyData = [
    { userId: demoUser.id, bookId: books[3].id, borrowedAt: pastDate(30), returnedAt: pastDate(10), status: 'RETURNED' as any },
    { userId: users[0].id, bookId: books[0].id, borrowedAt: pastDate(40), returnedAt: pastDate(20), status: 'RETURNED' as any },
    { userId: users[0].id, bookId: books[6].id, borrowedAt: pastDate(25), returnedAt: pastDate(5),  status: 'RETURNED' as any },
    { userId: users[1].id, bookId: books[2].id, borrowedAt: pastDate(35), returnedAt: pastDate(15), status: 'RETURNED' as any },
    { userId: users[1].id, bookId: books[8].id, borrowedAt: pastDate(20), returnedAt: pastDate(3),  status: 'RETURNED' as any },
    { userId: users[2].id, bookId: books[4].id, borrowedAt: pastDate(45), returnedAt: pastDate(25), status: 'RETURNED' as any },
    { userId: users[3].id, bookId: books[10].id, borrowedAt: pastDate(60), returnedAt: pastDate(40), status: 'RETURNED' as any },
    { userId: users[4].id, bookId: books[18].id, borrowedAt: pastDate(15), returnedAt: pastDate(2), status: 'RETURNED' as any },
    { userId: users[5].id, bookId: books[21].id, borrowedAt: pastDate(28), returnedAt: pastDate(8), status: 'RETURNED' as any },
    { userId: users[6].id, bookId: books[25].id, borrowedAt: pastDate(22), returnedAt: pastDate(2), status: 'RETURNED' as any },
    { userId: users[7].id, bookId: books[13].id, borrowedAt: pastDate(18), returnedAt: pastDate(1), status: 'RETURNED' as any },
    { userId: users[8].id, bookId: books[9].id,  borrowedAt: pastDate(50), returnedAt: pastDate(30), status: 'RETURNED' as any },
    { userId: users[9].id, bookId: books[27].id, borrowedAt: pastDate(12), returnedAt: null,         status: 'BORROWED' as any },
    { userId: demoUser.id, bookId: books[5].id,  borrowedAt: pastDate(55), returnedAt: pastDate(35), status: 'RETURNED' as any },
    { userId: users[0].id, bookId: books[16].id, borrowedAt: pastDate(8),  returnedAt: null,         status: 'BORROWED' as any },
  ];

  await prisma.bookHistory.createMany({ data: historyData });
  console.log(`📜 Kitob tarixi yaratildi`);

  // ============================================================
  // YAKUNIY HISOBOT
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('✅ SEED MUVAFFAQIYATLI YAKUNLANDI!');
  console.log('='.repeat(60));

  console.log('\n🔐 REAL HISOBLAR (maxfiy — faqat siz uchun):');
  console.log('─'.repeat(60));
  console.log('👑 SuperAdmin:');
  console.log(`   Telefon  : ${process.env.SUPER_ADMIN_PHONE}`);
  console.log(`   Parol    : ${process.env.SUPER_ADMIN_SECRET}`);
  console.log('🛡️  Admin:');
  console.log(`   Telefon  : ${process.env.REAL_ADMIN_PHONE || '+998977654321'}`);
  console.log(`   Parol    : ${process.env.REAL_ADMIN_SECRET || 'realadmin2026'}`);

  console.log('\n🎭 DEMO HISOBLAR (portfolioga tashrif buyuruvchilar uchun, faqat o\'qish):');
  console.log('─'.repeat(60));
  console.log('👑 Demo SuperAdmin:');
  console.log('   Telefon  : +998900000001');
  console.log('   Parol    : demo1234');
  console.log('🛡️  Demo Admin:');
  console.log('   Telefon  : +998900000002');
  console.log('   Parol    : demo1234');
  console.log('👤 Demo User:');
  console.log('   Telefon  : +998900000003');
  console.log('   Parol    : demo1234');
  console.log('   ⚠️  Demo hisoblar POST/PATCH/DELETE qila olmaydi!');
  console.log('='.repeat(60));
  console.log('\n📊 STATISTIKA:');
  console.log(`   Kutubxonalar : ${libraries.length}`);
  console.log(`   Kategoriyalar: ${categories.length}`);
  console.log(`   Mualliflar   : ${authors.length}`);
  console.log(`   Kitoblar     : ${books.length}`);
  console.log(`   Obunalar     : ${memberships.length}`);
  console.log(`   Foydalanuvchi: ${allUsers.length + 3}`);
  console.log(`   A'zolar      : ${members.length}`);
  console.log('='.repeat(55) + '\n');
}

main()
  .catch((e) => { console.error('❌ Seed xatosi:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
