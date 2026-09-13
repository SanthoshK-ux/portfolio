/**
 * Interactive Machine Learning & AI Pipeline Visualizer
 * Pipeline: Data -> Preprocessing -> Analysis -> Model -> Prediction -> Insight
 */

(function () {
  'use strict';

  const pipelineSteps = {
    data: {
      tag: 'Step 01 / Pipeline',
      title: 'Data Ingestion & Sourcing',
      desc: 'Extracting structured and unstructured data from relational databases (SQL, MySQL), flat files (CSV, Excel), and RESTful APIs with strict schema validation.',
      tools: 'Python, SQL, Pandas, REST APIs'
    },
    preprocessing: {
      tag: 'Step 02 / Pipeline',
      title: 'Data Hygiene & Feature Engineering',
      desc: 'Handling missing values, outlier detection, data type casting, categorical encoding, NLP tokenization, lemmatization, and vector transformations.',
      tools: 'Power Query, Scikit-Learn, NLTK, Regex'
    },
    analysis: {
      tag: 'Step 03 / Pipeline',
      title: 'Exploratory & Statistical Analysis',
      desc: 'Conducting in-depth EDA to discover underlying patterns, correlation matrices, hypothesis verification, and workforce/dataset distributions.',
      tools: 'DAX, Pandas, Matplotlib, Seaborn'
    },
    model: {
      tag: 'Step 04 / Pipeline',
      title: 'Model Training & Embeddings',
      desc: 'Employing classical machine learning models and modern NLP transformers (Sentence Transformers, TF-IDF) tailored to task objectives.',
      tools: 'Sentence Transformers, Scikit-Learn, AI APIs'
    },
    prediction: {
      tag: 'Step 05 / Pipeline',
      title: 'Inference & Semantic Scoring',
      desc: 'Executing inference pipelines, calculating cosine similarity distances, computing ATS match scores, and ranking candidate features accurately.',
      tools: 'Vector Cosine Similarity, Evaluation Metrics'
    },
    insight: {
      tag: 'Step 06 / Pipeline',
      title: 'Actionable Intelligence & Decision Impact',
      desc: 'Translating model outputs into clear business decisions, diagnostic reports, executive dashboards, and automated advisory feedback.',
      tools: 'Power BI Dashboards, Structured JSON, Executive Summaries'
    }
  };

  const stepButtons = document.querySelectorAll('.pipeline-step');
  const inspectorTag = document.getElementById('inspector-tag');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorDesc = document.getElementById('inspector-desc');
  const inspectorTools = document.getElementById('inspector-tools');

  if (!stepButtons.length || !inspectorTag) return;

  function setStep(stepKey) {
    const data = pipelineSteps[stepKey];
    if (!data) return;

    stepButtons.forEach(function (btn) {
      if (btn.getAttribute('data-step') === stepKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    inspectorTag.textContent = data.tag;
    inspectorTitle.textContent = data.title;
    inspectorDesc.textContent = data.desc;
    if (inspectorTools) {
      inspectorTools.textContent = data.tools;
    }
  }

  stepButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const stepKey = btn.getAttribute('data-step');
      setStep(stepKey);
    });
  });
})();
