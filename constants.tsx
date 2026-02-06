
import React from 'react';

// URL Utama Data Takwim & Program
export const TAKWIM_CSV_URL = "https://docs.google.com/spreadsheets/d/1MCP1TflZ0Ytrbkzj-Awnx7FN1ACj_HDY/export?format=csv";
export const PROGRAMS_CSV_URL = "https://docs.google.com/spreadsheets/d/1Jz4buGFkc_pKUgcQcpYWPkWJBeawQaAda1t5_hbRUbs/export?format=csv";

// Data PBD & Headcount daripada ID Spreadsheet Baharu: 173juIvOhviqc7ldDHibOtN_ZFO3apOHxbny8nXTGSDE
export const PBD_CSV_URL = "https://docs.google.com/spreadsheets/d/173juIvOhviqc7ldDHibOtN_ZFO3apOHxbny8nXTGSDE/export?format=csv&gid=0";
export const HEADCOUNT_CSV_URL = "https://docs.google.com/spreadsheets/d/173juIvOhviqc7ldDHibOtN_ZFO3apOHxbny8nXTGSDE/export?format=csv&gid=1119561937"; // Asumsi GID untuk Headcount

export const FOLDER_IMAGES_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLmCnHBO1eDDhUsl9QdFk2T95HH3E4aX9ugSUcpMqdebnQI2EOC-f4WxYGF0laK_38EEO3a2K_bnVX/pub?gid=319532007&single=true&output=csv"; 

export const MONTH_NAMES = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun",
  "Julai", "Ogos", "September", "Oktober", "November", "Disember"
];

export const DAY_NAMES = ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"];

export const ICONS = {
  Dashboard: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  Calendar: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  ),
  Trend: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  ),
  Users: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  Book: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
  ),
  Bot: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
  ),
  Chart: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  )
};
