import db from '../configs/database';

const ACTIVE_ANNOUNCEMENTS_LIMIT = 10;

function toAnnouncement(data: any): Announcement | null {
    try {
        return {
            id: data.id,
            title: data.title ?? null,
            content: data.content,
            mode: data.mode as Announcement_Mode,
            repeat_interval_hours: data.repeat_interval_hours ?? null,
            priority: data.priority,
            is_active: data.is_active,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    } catch (err) {
        return null;
    }
}

function toAnnouncementArray(rows: any[]): Announcement[] {
    const announcements: Announcement[] = [];

    rows.forEach(row => {
        const announcement = toAnnouncement(row);
        if (announcement) {
            announcements.push(announcement);
        }
    });

    return announcements;
}

function toAnnouncementSeen(data: any): Announcement_Seen | null {
    try {
        return {
            id: data.id,
            user_id: data.user_id,
            announcement_id: data.announcement_id,
            last_seen_date: data.last_seen_date
        };
    } catch (err) {
        return null;
    }
}

function toAnnouncementSeenArray(rows: any[]): Announcement_Seen[] {
    const seen: Announcement_Seen[] = [];

    rows.forEach(row => {
        const entry = toAnnouncementSeen(row);
        if (entry) {
            seen.push(entry);
        }
    });

    return seen;
}

export default class AnnouncementController {
    static async getActive(limit: number = ACTIVE_ANNOUNCEMENTS_LIMIT): Promise<Announcement[]> {
        return toAnnouncementArray(
            await db.announcement.findMany({
                where: {
                    is_active: true
                },
                orderBy: [{ priority: 'desc' }, { id: 'asc' }],
                take: limit
            })
        );
    }

    static async getUserSeen(userId: number, announcementIds: number[]): Promise<Announcement_Seen[]> {
        if (announcementIds.length === 0) {
            return [];
        }

        return toAnnouncementSeenArray(
            await db.announcements_seen.findMany({
                where: {
                    user_id: userId,
                    announcement_id: {
                        in: announcementIds
                    }
                }
            })
        );
    }

    static async markSeen(userId: number, announcementId: number): Promise<void> {
        await db.announcements_seen.upsert({
            where: {
                user_id_announcement_id: {
                    user_id: userId,
                    announcement_id: announcementId
                }
            },
            update: {
                last_seen_date: new Date()
            },
            create: {
                user_id: userId,
                announcement_id: announcementId,
                last_seen_date: new Date()
            }
        });
    }
}
