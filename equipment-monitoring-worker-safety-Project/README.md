AI Equipment Monitoring & Worker Safety System

This project is a full-stack web application developed to improve industrial equipment management and workplace safety through a centralized digital platform.

The main objective of this project is to provide an easy-to-use system where administrators can manage equipment information while also monitoring worker safety from a single dashboard.

The application is divided into two major modules:

• Equipment Monitoring
• Worker Safety Management

The Equipment Monitoring module allows users to add, update, and manage equipment records. Each equipment entry stores important information such as equipment name, model number, manufacturer, installation date, maintenance details, and operational status. This helps maintain an organized inventory and simplifies equipment tracking.

The Worker Safety module is designed to support workplace safety by providing a dedicated interface for monitoring safety-related information. It serves as the foundation for integrating additional safety features and future AI-based monitoring capabilities.

The backend of the application is developed using FastAPI, which provides a lightweight and high-performance REST API. The API is responsible for handling business logic, database operations, request validation, and communication with the frontend.

MongoDB is used as the primary database to store equipment records and other application data. Its flexible document-based structure makes it suitable for handling industrial information efficiently.

The frontend is built using React, TypeScript, and Vite to create a fast, responsive, and user-friendly interface. The application is designed with reusable components and a modular folder structure, making it easy to maintain and extend.

Some of the key features included in this project are:

• Equipment information management
• Add and update equipment records
• Worker safety interface
• Dashboard for monitoring operations
• RESTful API architecture
• MongoDB database integration
• Responsive frontend
• Modular backend design

Technology Stack

Frontend
- React
- TypeScript
- Vite

Backend
- FastAPI
- Python

Database
- MongoDB

Development Tools
- Git
- GitHub
- Visual Studio Code

Project Structure

backend/
Contains the FastAPI application, API routes, database models, services, and application logic.

frontend/
Contains the React application, user interface components, pages, and client side functionality.

This project has been developed with a modular architecture to allow future enhancements such as AI-powered equipment monitoring, predictive maintenance, real-time alerts, computer vision integration, and advanced worker safety analytics.

The repository contains both the frontend and backend source code making it easy to set up, modify, and extend the application for future development or integration with other systems.

This project was created as part of a practical learning experience in full-stack application development, focusing on building scalable software using modern web technologies while addressing real-world industrial monitoring and worker safety requirements.
