# 🏦 NovaPay Banking Dashboard

A full stack real-time banking application built with React, Spring Boot and MySQL.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Recharts, React Router v6, Axios |
| Backend | Spring Boot 4, Spring Security 7, Hibernate |
| Database | MySQL 8, JPA |
| Auth | JWT + OTP 2FA via Gmail |
| Real-time | WebSocket (STOMP) |

## 📁 Project Structure

novapay-fullstack/
├── backend/     ← Spring Boot REST API
├── frontend/    ← React 18 UI
└── database/    ← MySQL Schema

## ✨ Features

- JWT Authentication + OTP 2FA via Gmail
- ACID Fund Transfers with rollback
- Real-time Fraud Alerts via WebSocket
- Spending Analytics with Bar, Pie, Area Charts
- Transaction History with Filter + CSV Export
- Scheduled Fraud Scanner
- Beautiful Dark UI with Glassmorphism

## ⚙️ Setup

### Step 1 - Database
Run schema.sql in MySQL Workbench

### Step 2 - Backend
cd backend
Copy application.example.properties to application.properties
Fill your MySQL and Gmail credentials
mvn spring-boot:run

### Step 3 - Frontend
cd frontend
npm install
npm start