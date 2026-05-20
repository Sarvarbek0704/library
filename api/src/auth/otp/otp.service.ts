import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { eskizConfig } from '../../config/eskiz.config';

@Injectable()
export class OtpService {
  private otpStore: Map<string, string> = new Map(); // in-memory

  async sendOtp(phone: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(phone, otp);

    setTimeout(() => this.otpStore.delete(phone), 5 * 60 * 1000);

    
    
    
      
  
    // Eskiz API ga so'rov
    // try {
    //   await axios.post(
    //     eskizConfig.serviceUrl,
    //     {
    //       mobile_phone: phone,
    //       message: `Sizning OTP kodingiz: ${otp}`,
    //       from: eskizConfig.sender,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${eskizConfig.apiKey}`,
    //         'Content-Type': 'application/json',
    //       },
    //     },
    //   );
    // } catch (err) {
    //   console.error(
    //     'Eskiz SMS yuborishda xato:',
    //     err.response?.data || err.message,
    //   );
    //   throw new Error('SMS yuborilmadi');
    // }
    
    return otp; // faqat test uchun
  }

  verifyOtp(phone: string, otp: string): boolean {
    const validOtp = this.otpStore.get(phone);
    if (validOtp && validOtp === otp) {
      this.otpStore.delete(phone);
      return true;
    }
    return false;
  }
}
