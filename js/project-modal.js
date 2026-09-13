/**
 * Interactive Project Detail Modal System
 * Provides comprehensive deep-dive view into projects with authentic details:
 * Problem, Solution, Technology, Key Features, Implementation, Results, GitHub, Live Demo.
 */

(function () {
  'use strict';

  const projectsData = {
    'hr-analytics': {
      title: 'HR Analytics Dashboard',
      category: 'Business Intelligence / Data Analytics',
      tech: 'Power BI · Power Query · DAX · Excel',
      github: 'https://github.com/SanthoshK-ux/HR-Data-Analytics',
      demo: '#',
      demoText: 'View Dashboard Schema',
      problem:
        'Human resources teams frequently struggle with fragmented employee records scattered across multiple spreadsheets, making it difficult to analyze headcount trends, employee turnover drivers, and demographic representation in a unified view.',
      solution:
        'Engineered an interactive Business Intelligence dashboard in Power BI that consolidates workforce data, calculates automated retention metrics through custom DAX expressions, and presents executive-level visualizations with dynamic multi-dimensional slicers.',
      technology: [
        'Power BI Desktop for enterprise data modeling and interactive visualization',
        'Power Query for automated ETL (extract, transform, load), deduplication, and schema standardization',
        'DAX (Data Analysis Expressions) for calculated measures, attrition percentages, and running totals',
        'Microsoft Excel for source data structuring and relational validation'
      ],
      features: [
        'Workforce headcount and demographic distribution monitoring',
        'Department-wise attrition rate calculation and trend breakdown',
        'Interactive slicers for department, tenure, job role, and education level',
        'Gender diversity ratio analysis across organizational tiers',
        'Dynamic KPI cards tracking active employees, attrition count, and turnover rate',
        'Clean star-schema data modeling for optimal report filtering performance'
      ],
      implementation:
        'Ingested raw workforce datasets into Power Query, applied data hygiene transformations (handling nulls, typing columns, and standardizing categorical fields), authored optimized DAX calculated measures (e.g. Total Active Headcount, Attrition Rate %, Attrition by Age Band), and created high-contrast visual reporting pages with intuitive layout hierarchy.',
      results:
        'Delivered an executive-ready reporting solution that provides clear visibility into organizational retention patterns and enables instant drill-down without manual spreadsheet manipulation.'
    },

    'ai-resume-analyzer': {
      title: 'AI Resume Analyzer',
      category: 'AI / NLP / Machine Learning',
      tech: 'Python · NLP · Sentence Transformers · TF-IDF · AI APIs',
      github: 'https://github.com/SanthoshK-ux',
      demo: '#',
      demoText: 'Explore Prototype',
      problem:
        'Job seekers frequently lack transparent insight into how applicant tracking systems (ATS) score their resumes against target job descriptions and struggle to identify specific technical skill gaps or missing keywords required for competitive roles.',
      solution:
        'Built an AI-driven resume analysis platform that evaluates candidate resumes against job descriptions using Natural Language Processing (NLP), semantic text matching via transformer embeddings, and AI APIs to generate objective ATS match scores, identify missing competencies, and produce tailored interview preparation questions.',
      technology: [
        'Python 3 for core processing and backend algorithmic pipeline',
        'Natural Language Processing (NLP) with tokenization, lemmatization, and stop-word filtering',
        'Sentence Transformers for semantic embeddings and dense vector representations',
        'TF-IDF Vectorization for exact keyword frequency and importance scoring',
        'AI APIs for generating candidate feedback and contextual interview questions',
        'PyPDF2 / PDFMiner for robust document text extraction'
      ],
      features: [
        'Automated resume document parsing and text normalization',
        'Objective ATS-style match scoring based on semantic similarity and keyword density',
        'Semantic job-to-resume matching beyond simple keyword searching',
        'Detailed skill-gap identification distinguishing hard and soft competencies',
        'Constructive AI-generated feedback highlighting resume strengths and improvement areas',
        'Customized interview question generation based on detected experience gaps'
      ],
      implementation:
        'Structured an end-to-end NLP pipeline that ingests candidate resumes in PDF format, extracts clean textual tokens, computes cosine similarity against job descriptions using Sentence Transformers and TF-IDF matrices, and queries AI model endpoints with carefully engineered prompts to produce structured feedback and question lists.',
      results:
        'Successfully developed a working end-to-end prototype combining classical NLP vectorization with modern embedding models, demonstrating the practical application of AI in talent acquisition and career preparation.'
    },

    'weather-app': {
      title: 'Weather Application',
      category: 'Python Application',
      tech: 'Python · Weather API · Requests · JSON',
      github: 'https://github.com/SanthoshK-ux',
      demo: '#',
      demoText: 'View Sample Output',
      problem:
        'Users frequently require quick, reliable, real-time meteorological information for specific geographic locations without navigating cluttered, ad-heavy web portals.',
      solution:
        'Developed a clean, efficient Python application that connects to live RESTful weather APIs to retrieve real-time location-based weather metrics, featuring robust input validation and comprehensive error handling for seamless user experience.',
      technology: [
        'Python 3 for application logic and data handling',
        'RESTful Weather API (OpenWeatherMap) for real-time meteorological data feeds',
        'Requests library for secure HTTP client communications and parameter passing',
        'JSON module for payload deserialization and dictionary extraction'
      ],
      features: [
        'Real-time location search across global cities and regions',
        'Comprehensive weather metrics: temperature, feels-like, humidity, pressure, and wind velocity',
        'Weather condition descriptions with corresponding meteorological status',
        'Defensive error handling for invalid city names, network timeouts, and API rate limits',
        'Clean formatted terminal / UI output with unit conversions'
      ],
      implementation:
        'Designed modular Python functions to handle user queries, dispatch authenticated HTTP GET requests with query parameters, validate response status codes (200, 404, 500), safely parse nested JSON dictionaries, and render formatted weather summaries.',
      results:
        'Produced a dependable, standalone Python utility that demonstrates effective third-party API integration, defensive coding, and structured data handling.'
    }
  };

  const modalBackdrop = document.getElementById('project-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalProblem = document.getElementById('modal-problem');
  const modalSolution = document.getElementById('modal-solution');
  const modalTechList = document.getElementById('modal-tech-list');
  const modalFeatureList = document.getElementById('modal-feature-list');
  const modalImplementation = document.getElementById('modal-implementation');
  const modalResults = document.getElementById('modal-results');
  const modalGithubBtn = document.getElementById('modal-github-btn');
  const modalDemoBtn = document.getElementById('modal-demo-btn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalProblem.textContent = data.problem;
    modalSolution.textContent = data.solution;
    modalImplementation.textContent = data.implementation;
    modalResults.textContent = data.results;

    modalGithubBtn.href = data.github;
    modalDemoBtn.href = data.demo;
    modalDemoBtn.textContent = data.demoText;

    // Tech list
    modalTechList.innerHTML = '';
    data.technology.forEach(function (t) {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${t}</span>
      `;
      modalTechList.appendChild(li);
    });

    // Features list
    modalFeatureList.innerHTML = '';
    data.features.forEach(function (f) {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${f}</span>
      `;
      modalFeatureList.appendChild(li);
    });

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach triggers
  document.querySelectorAll('[data-project-trigger]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-trigger');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });
  }

  // Close on Escape key
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeProjectModal();
    }
  });
})();
