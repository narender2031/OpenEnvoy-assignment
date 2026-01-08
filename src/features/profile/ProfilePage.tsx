import { useEffect } from 'react'
import { Briefcase, Clock, Users, CheckSquare, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchProfile,
  fetchProfileStats,
  selectProfile,
  selectProfileStats,
  selectProfileStatus,
  selectStatsStatus,
} from './profileSlice'
import { StatCard, Spinner } from '@/components'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const stats = useAppSelector(selectProfileStats)
  const profileStatus = useAppSelector(selectProfileStatus)
  const statsStatus = useAppSelector(selectStatsStatus)

  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchProfileStats())
  }, [dispatch])

  if (profileStatus === 'loading') {
    return (
      <div className={styles.loadingState}>
        <Spinner size="lg" label="Loading profile" />
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.errorState}>
        <p>Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Profile Header */}
      <section className={styles.profileHeader}>
        <div className={styles.profileCard}>
          <img
            src={profile.avatar}
            alt={`${profile.name}'s avatar`}
            className={styles.avatar}
          />
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.role}</p>
            <p className={styles.department}>{profile.department}</p>
          </div>
        </div>
        <div className={styles.bio}>
          <p>{profile.bio}</p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className={styles.statsStrip} aria-label="Profile Statistics">
        <StatCard
          icon={<Briefcase size={32} />}
          iconBg="green"
          title="Projects Completed"
          value={statsStatus === 'succeeded' && stats ? stats.projectsCompleted.toString() : '—'}
        />
        <StatCard
          icon={<CheckSquare size={32} />}
          iconBg="purple"
          title="Tasks Completed"
          value={statsStatus === 'succeeded' && stats ? stats.tasksCompleted.toString() : '—'}
        />
        <StatCard
          icon={<Clock size={32} />}
          iconBg="blue"
          title="Hours Logged"
          value={statsStatus === 'succeeded' && stats ? stats.hoursLogged.toLocaleString() : '—'}
        />
        <StatCard
          icon={<Users size={32} />}
          iconBg="green"
          title="Team Size"
          value={statsStatus === 'succeeded' && stats ? stats.teamSize.toString() : '—'}
        />
      </section>

      {/* Contact Information */}
      <section className={styles.detailsCard}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <Mail size={20} className={styles.contactIcon} />
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Email</span>
              <span className={styles.contactValue}>{profile.email}</span>
            </div>
          </div>
          <div className={styles.contactItem}>
            <Phone size={20} className={styles.contactIcon} />
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Phone</span>
              <span className={styles.contactValue}>{profile.phone}</span>
            </div>
          </div>
          <div className={styles.contactItem}>
            <MapPin size={20} className={styles.contactIcon} />
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Location</span>
              <span className={styles.contactValue}>{profile.location}</span>
            </div>
          </div>
          <div className={styles.contactItem}>
            <Calendar size={20} className={styles.contactIcon} />
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Joined</span>
              <span className={styles.contactValue}>
                {profile.joinedDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
