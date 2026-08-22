import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import ToggleStatusBtn from './ToggleStatusBtn';

export const dynamic = 'force-dynamic';

export default async function AdminCycleClassesPage(props: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || 'all';

  let whereClause = {};
  if (filter === 'pending') {
    whereClause = { contacted: false };
  } else if (filter === 'contacted') {
    whereClause = { contacted: true };
  }

  type CycleClassInquiry = { id: string; name: string; email: string; phone: string; experienceLevel?: string; message?: string; contacted: boolean; createdAt: Date; };
  
  const prismaInquiry = prisma as unknown as { cycleClassInquiry: { findMany: (args: unknown) => Promise<CycleClassInquiry[]> } };
  const inquiries = await prismaInquiry.cycleClassInquiry.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Cycle Class Inquiries</h1>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: '#222', padding: '0.3rem', borderRadius: '8px', border: '1px solid #444' }}>
          <Link href="/admin/cycle-classes?filter=all" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', background: filter === 'all' ? '#444' : 'transparent', color: filter === 'all' ? '#fff' : '#aaa' }}>All</Link>
          <Link href="/admin/cycle-classes?filter=pending" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', background: filter === 'pending' ? '#444' : 'transparent', color: filter === 'pending' ? '#fff' : '#aaa' }}>Pending</Link>
          <Link href="/admin/cycle-classes?filter=contacted" style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', background: filter === 'contacted' ? '#444' : 'transparent', color: filter === 'contacted' ? '#fff' : '#aaa' }}>Contacted</Link>
        </div>
      </div>
      
      {inquiries.length === 0 ? (
        <div style={{ padding: '2rem', background: '#222', borderRadius: '8px', textAlign: 'center', color: '#aaa' }}>
          No inquiries found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#222', borderRadius: '8px', overflow: 'hidden' }}>
            <thead style={{ background: '#333' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid #444', color: '#ccc' }}>Name</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #444', color: '#ccc' }}>Contact</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #444', color: '#ccc' }}>Experience</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #444', color: '#ccc' }}>Message</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #444', color: '#ccc' }}>Date</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #444', color: '#ccc' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry: CycleClassInquiry) => (
                <tr key={inquiry.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #444' }}><strong>{inquiry.name}</strong></td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #444' }}>
                    <div>{inquiry.email}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{inquiry.phone}</span>
                      <a 
                        href={`tel:${inquiry.phone.replace(/[^0-9+]/g, '')}`} 
                        style={{ background: '#1eb53a', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Call
                      </a>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #444' }}>{inquiry.experienceLevel || '-'}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #444', maxWidth: '300px' }}>
                    {inquiry.message ? (
                      <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{inquiry.message}</div>
                    ) : (
                      <span style={{ color: '#777' }}>No message</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #444', color: '#aaa', fontSize: '0.9rem' }}>
                    {new Date(inquiry.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #444' }}>
                    <ToggleStatusBtn id={inquiry.id} isContacted={inquiry.contacted || false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
