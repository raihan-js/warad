# 🌙 Warad — Your Daily Qur’an Recitation Companion

**Warad** is a mobile app designed to help Muslims maintain fluency in Qur’an recitation through consistent daily practice. Inspired by the founder's personal journey and challenges in maintaining Tajweed and fluency as an adult, Warad aims to solve a real, spiritual need with technology.

> **"Warad" (وِرْد) refers to the daily portion of recitation or dhikr.**  
> This app helps you make Qur’anic practice a regular, rewarding habit — no matter your fluency level.

---

## 📱 App Features (MVP & Beyond)

### ✅ MVP (v1)
- **Daily Recitation Plan**: Recite a few ayahs daily from selected Surahs.
- **Clean Practice UI**: Arabic text, transliteration, and meaning displayed.
- **Audio Recording**: Record your recitation using `expo-av`.
- **Playback**: Listen to your own voice and compare to reference reciters.
- **Surah Selection**: Start from Juz Amma or choose a Surah.
- **Progress Tracking (local)**: Daily streaks and simple session history.

### 🚀 Planned Premium Features (v2+)
- **AI-Powered Recitation Feedback** (using Whisper by OpenAI):
  - Detect incorrect, skipped, or mispronounced words
  - Highlight mistakes (e.g., ❌ red overlay on incorrect words)
- **Fluency Scoring**: Show user fluency over time.
- **Habit Engine**: Daily reminders and practice streaks.
- **Tajweed Guidance** (future): Identify missed Tajweed rules like Madd, Ghunna, etc.
- **Bangladeshi Accent Optimization**: Fine-tuned voice model for local reciters.
- **Offline Mode**: Recite without internet access.

---

## 🧱 Tech Stack

- **React Native** (Expo CLI)
- **EAS CLI** for builds and deployments
- **Audio**: `expo-av`, `expo-file-system`
- **Navigation**: React Navigation
- **Backend (Planned)**: Whisper backend API, Supabase or Firebase
- **Voice AI**: Whisper (for transcription + feedback)
- **Qur’an Data**: [Quran.com API](https://quran.api-docs.io/) for Surah and ayah data


---

## 🔧 Get Started

1. **Install dependencies**

   ```bash
   npm install
   ````

2. **Run the app**

   ```bash
   npx expo start
   ```

   You can open the app in:

   * [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   * [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   * [Expo Go](https://expo.dev/go)

3. **Reset project to start fresh**

   ```bash
   npm run reset-project
   ```

---

## 💡 Inspiration

> “I completed the Qur’an as a child, but years later I struggle with certain Surahs due to lack of practice. This app is my solution for myself and others like me.”

---

## 📚 Resources

* [Expo Documentation](https://docs.expo.dev/)
* [Quran.com API](https://quran.api-docs.io/)
* [Whisper by OpenAI](https://platform.openai.com/docs/guides/speech-to-text)
* [Tarteel AI (Reference)](https://tarteel.ai)

---

## 📬 Contact & Contributions

**Author**: Akteruzzaman Raihan Sikder
📧 [bracketi2023@gmail.com](mailto:bracketi2023@gmail.com)
🌐 GitHub and production repo to be added soon.

---

## 🕋 Made for Muslims — By a Muslim

**Warad** is built with the intention of serving the ummah by helping Muslims strengthen their connection with the Qur’an. May Allah accept this effort. 🤲

