'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const proxyImage = (url: string) =>
  `/api/image-proxy?url=${encodeURIComponent(url)}`;
import { Play, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import styles from './InstagramWidget.module.css';

interface Post {
  id: string;
  type: 'post' | 'reel';
  image: string;
  link: string;
  likes: number;
  comments: number;
  caption: string;
  timestamp: string;
}

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

function formatCount(n: number): string {
  if (!n) return '–';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toString();
}

export function InstagramWidget() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/instagram', { signal: controller.signal });
        const data = await response.json();

        if (response.ok && data.posts?.length > 0) {
          setPosts(data.posts);
        } else {
          setError(true);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('[InstagramWidget] fetch failed:', err);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, []);

  // Don't render anything if we have nothing to show and not loading
  if (!loading && (error || posts.length === 0)) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className={styles.title}>
              Follow Us on{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Instagram
              </span>
            </h2>
            <p className={styles.subtitle}>
              Catch our latest updates, reels, and community stories.
            </p>
          </div>

          <Link
            href="https://www.instagram.com/wheelo.fit/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.followButton}
          >
            <InstagramIcon size={18} />
            <span>@wheelo.fit</span>
          </Link>
        </motion.div>

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={`sk-${i}`} className={`${styles.postCard} ${styles.skeleton}`} />
              ))
            : posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.postCard}
                  >
                    <div className={styles.imageWrapper}>
                      <img
                        src={proxyImage(post.image)}
                        alt={post.caption || 'Wheelo.fit Instagram post'}
                        className={styles.image}
                        loading="lazy"
                      />

                      {post.type === 'reel' && (
                        <div className={styles.reelIcon}>
                          <Play size={22} fill="currentColor" />
                        </div>
                      )}

                      <div className={styles.overlay}>
                        <div className={styles.stats}>
                          <div className={styles.stat}>
                            <Heart size={18} fill="currentColor" />
                            <span>{formatCount(post.likes)}</span>
                          </div>
                          <div className={styles.stat}>
                            <MessageCircle size={18} fill="currentColor" />
                            <span>{formatCount(post.comments)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
