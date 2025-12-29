# Barchasb_Ads

A professional-grade Node.js & MongoDB backend for a multi-category Iranian advertisement platform. Features 4 distinct ad models (Seller, Employer, Job Seeker, Digital), secure Multer file uploads, and a normalized NoSQL architecture.

* **Multi-Category Schema**: Distinct Mongoose models for different business needs:
    * **Seller Ads**: For physical goods with attribute mapping.
    * **Employer Ads**: Detailed job recruitment forms with salary ranges.
    * **Job Seeker Ads**: Resume profiles with PDF upload support.
    * **Digital Ads**: Project-based freelance requests with skill tagging.
* **Secure File Management**: 
    * Centralized **Multer** middleware.
    * Validation for file types (JPEG, PNG, PDF).
    * Automated main-image selection logic via Mongoose pre-save hooks.
* **Relational Mapping**: All ads are linked to a centralized **User** model using MongoDB ObjectIds.
* **Developer Friendly**: Includes a seeding script to populate the database for testing in seconds.

## Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (via Mongoose ODM)
* **Media Handling**: Multer
* **Environment**: Dotenv
---

## Installation

Clone the repository:

```bash
git clone https://github.com/ZahraAbbakhsh99/Barchasb_Ads.git
```
Install dependencies:

```bash
npm install
```

## Setup
Copy .env.example to .env:

```bash
cp .env.example .env
```
Open .env and fill it

## Seed the Database

```bash
node data/seed.js
```

## Run 

```bash
node server.js
```
