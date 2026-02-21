# 🚚 FleetFlow --- Modular Fleet & Logistics Management System

> Transforming fleet operations from manual logbooks into intelligent,
> rule‑driven digital logistics.

FleetFlow is a centralized fleet lifecycle management platform designed
to optimize vehicle utilization, driver compliance, operational safety,
and financial performance for modern delivery ecosystems.

------------------------------------------------------------------------

## ✨ Overview

Traditional logistics operations rely heavily on fragmented spreadsheets
and manual tracking systems, leading to poor utilization, compliance
risks, maintenance negligence, and financial opacity.

FleetFlow replaces this with a modular command center that digitally
manages assets, drivers, trips, expenses, and analytics through
automated workflows and rule enforcement.

------------------------------------------------------------------------

## 🧠 Key Features

### 🔐 Role‑Based Authentication

Secure login system with RBAC support for Fleet Managers, Dispatchers,
Safety Officers, and Financial Analysts.

### 📊 Command Center Dashboard

-   Active Fleet Monitoring
-   Maintenance Alerts
-   Fleet Utilization Rate
-   Pending Cargo Tracking

### 🚛 Vehicle Registry

Centralized asset lifecycle tracking: - License Plate Unique ID - Load
Capacity - Odometer Monitoring - Retirement Toggle

### 📦 Smart Trip Dispatcher

Trip Lifecycle:

Draft → Dispatched → Completed → Cancelled

Rule Engine:

Cargo Weight \> Vehicle Capacity → Dispatch Blocked

Automatic status updates ensure vehicle and driver availability
accuracy.

### 🛠 Maintenance & Service Logs

Maintenance entries automatically mark vehicles as **In Shop**,
preventing dispatcher assignment.

### ⛽ Expense & Fuel Logging

Tracks: - Fuel Liters - Cost - Date

Automated operational cost calculations.

### 👨‍✈️ Driver Performance & Safety Profiles

-   License Expiry Monitoring
-   Duty Status Tracking
-   Safety Scores
-   Trip Completion Metrics

Expired licenses automatically block dispatch.

### 📈 Operational Analytics

-   Fuel Efficiency (km/L)
-   Vehicle ROI
-   Cost Per KM

Exportable CSV and PDF reporting.

------------------------------------------------------------------------

## ⚙️ Workflow Logic

1.  Vehicle Added → Available
2.  Driver Compliance Verified
3.  Cargo Assigned → Capacity Validation
4.  Trip Completed → Availability Reset
5.  Maintenance Logged → In Shop
6.  Fuel Logs → Analytics Updated

------------------------------------------------------------------------

## 🏗 Tech Stack

Frontend: - React.js

Backend: - Node.js - Express.js

Database: - Relatonal Model linking Vehicles, Trips, Expenses, and
Drivers.

------------------------------------------------------------------------

## 🚀 Getting Started

Clone repository:

git clone https://github.com/yourusername/fleetflow.git

Install dependencies:

npm install

Run Backend:

npm run server

Run Frontend:

npm start

------------------------------------------------------------------------

## 🎯 Target Users

-   Fleet Managers
-   Dispatch Coordinators
-   Safety Officers
-   Financial Analysts

Ideal for logistics companies, delivery startups, and fleet operators.

------------------------------------------------------------------------

## 💡 Innovation Highlights

-   Rule‑Based Dispatch Automation
-   Compliance‑Aware Driver Assignment
-   Maintenance Linked Availability Logic
-   Cost‑Per‑KM Analytics Engine
-   Modular Expandable Architecture

------------------------------------------------------------------------

## 👥 Team

Built during a Hackathon by:

-   Your Name
-   Team Member
-   Team Member

------------------------------------------------------------------------

## 🔮 Future Scope

-   AI Predictive Maintenance
-   Route Optimization
-   IoT Vehicle Integration
-   Fuel Theft Detection
-   Mobile Driver App

------------------------------------------------------------------------

## ❤️ Final Note

FleetFlow is more than fleet tracking --- it is an operational
intelligence system built to empower logistics teams with clarity,
compliance, and cost efficiency.
