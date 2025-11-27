import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    requirement: number;
    type: 'feeding' | 'sleep' | 'diaper' | 'milestone' | 'streak';
}

export interface UserLevel {
    currentLevel: number;
    currentXP: number;
    nextLevelXP: number;
    totalXP: number;
    title: string;
}

const LEVELS = [
    { level: 1, xp: 0, title: 'Yeni Başlayan' },
    { level: 2, xp: 100, title: 'Öğrenen Anne' },
    { level: 3, xp: 300, title: 'Keşifçi' },
    { level: 4, xp: 600, title: 'Deneyimli' },
    { level: 5, xp: 1000, title: 'Süper Anne' },
    { level: 6, xp: 1500, title: 'Uzman Anne' },
    { level: 7, xp: 2200, title: 'Efsanevi Anne' },
];

const BADGES: Badge[] = [
    { id: 'first_feed', title: 'İlk Besleme', description: 'İlk besleme kaydını oluşturdun!', icon: 'baby-bottle', unlocked: false, requirement: 1, type: 'feeding' },
    { id: 'feed_master', title: 'Beslenme Uzmanı', description: '50 besleme kaydı oluşturdun!', icon: 'nutrition', unlocked: false, requirement: 50, type: 'feeding' },
    { id: 'sleep_guru', title: 'Uyku Gurusu', description: '20 uyku kaydı oluşturdun!', icon: 'moon', unlocked: false, requirement: 20, type: 'sleep' },
    { id: 'diaper_hero', title: 'Bez Kahramanı', description: '30 bez değişimi kaydettin!', icon: 'water', unlocked: false, requirement: 30, type: 'diaper' },
    { id: 'streak_3', title: 'İstikrarlı', description: '3 gün üst üste uygulama kullandın!', icon: 'flame', unlocked: false, requirement: 3, type: 'streak' },
];

const XP_REWARDS = {
    ADD_ACTIVITY: 10,
    DAILY_LOGIN: 20,
    COMPLETE_PROFILE: 50,
    SHARE_MILESTONE: 30,
};

class GamificationService {
    private static STORAGE_KEY = '@gamification_data';

    async getUserLevel(): Promise<UserLevel> {
        const data = await this.getData();
        const totalXP = data.totalXP || 0;

        let currentLevel = LEVELS[0];
        let nextLevel = LEVELS[1];

        for (let i = 0; i < LEVELS.length; i++) {
            if (totalXP >= LEVELS[i].xp) {
                currentLevel = LEVELS[i];
                nextLevel = LEVELS[i + 1] || { level: i + 2, xp: LEVELS[i].xp * 1.5, title: 'Master' };
            }
        }

        return {
            currentLevel: currentLevel.level,
            currentXP: totalXP - currentLevel.xp,
            nextLevelXP: nextLevel.xp - currentLevel.xp,
            totalXP,
            title: currentLevel.title,
        };
    }

    async addXP(amount: number): Promise<{ newLevel: boolean, level: UserLevel }> {
        const data = await this.getData();
        const oldLevel = await this.getUserLevel();

        data.totalXP = (data.totalXP || 0) + amount;
        await this.saveData(data);

        const newLevel = await this.getUserLevel();

        return {
            newLevel: newLevel.currentLevel > oldLevel.currentLevel,
            level: newLevel,
        };
    }

    async getBadges(): Promise<Badge[]> {
        const data = await this.getData();
        const unlockedIds = data.unlockedBadges || [];

        return BADGES.map(badge => ({
            ...badge,
            unlocked: unlockedIds.includes(badge.id),
        }));
    }

    async checkBadges(activityType: string, count: number): Promise<Badge | null> {
        const badges = await this.getBadges();
        const relatedBadges = badges.filter(b => b.type === activityType && !b.unlocked);

        for (const badge of relatedBadges) {
            if (count >= badge.requirement) {
                await this.unlockBadge(badge.id);
                return badge;
            }
        }

        return null;
    }

    private async unlockBadge(badgeId: string) {
        const data = await this.getData();
        const unlockedBadges = data.unlockedBadges || [];

        if (!unlockedBadges.includes(badgeId)) {
            unlockedBadges.push(badgeId);
            data.unlockedBadges = unlockedBadges;
            await this.saveData(data);
        }
    }

    private async getData() {
        try {
            const jsonValue = await AsyncStorage.getItem(GamificationService.STORAGE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : { totalXP: 0, unlockedBadges: [] };
        } catch (e) {
            return { totalXP: 0, unlockedBadges: [] };
        }
    }

    private async saveData(data: any) {
        try {
            await AsyncStorage.setItem(GamificationService.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving gamification data', e);
        }
    }
}

export const gamificationService = new GamificationService();
export const XP_VALUES = XP_REWARDS;
