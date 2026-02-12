# 🎫 PH Event Hub -  Ticketing System

Isang modernong Event Management at Ticketing System na binuo gamit ang **Nuxt 3** at **Vuetify 3**, na may integration sa **Strapi CMS**. Ang system na ito ay dinisenyo para sa mga employees upang mapamahalaan ang mga events, reservations, at attendance nang mabilis at secured.

## 🚀 Features

* **Secure Authentication**: Gumagamit ng `auth_token` cookies at custom middleware para protektahan ang mga dashboard at form routes.
* **Dynamic Dashboard**: Real-time fetching ng mga events mula sa Strapi.
* **Reservation System**: Integrated booking form na nag-uugnay ng ticket records sa specific events.
* **Attendance Tracking**: Pinapadali ang monitoring ng event participants.
* **Modern UI/UX**: Glassmorphism design aesthetics gamit ang Vuetify components.

## 🛠️ Tech Stack

* **Frontend**: [Nuxt 3](https://nuxt.com/) (Vue.js Framework)
* **UI Framework**: [Vuetify 3](https://vuetifyjs.com/)
* **Backend/CMS**: [Strapi](https://strapi.io/)
* **Icons**: Material Design Icons (MDI)

## 📁 Project Structure

Base sa optimized routing ng system:

```text
pages/
├── attendance/
│   └── attendance.vue      # Monitoring of participants
├── dashboard/
│   └── index.vue           # Main event listing & navigation
├── edit/
│   └── edit-event.vue      # Event modification tool
├── reserve/
│   └── reservations.vue    # Ticket booking & submission form
└── login.vue               # Secured entry point
# Ticketing Nuxt Frontend

This is the **frontend application** for the Ticketing system built using **Nuxt 3** and **Vuetify**.  
It allows users to view events, reserve tickets, and manage their reservations.

---

## Features

- Secure ticket reservation form
- Event selection card
- Form validation and success alerts
- Pending ticket status for verification
- Redirect to dashboard after reservation
- Cancel and go back button
- Built with **Nuxt 3** and **Vuetify 3**
- API integration with **Strapi backend**

---

## Installation

1. Clone this repository:

```bash
git clone https://github.com/gienellad/final_frontend.git
