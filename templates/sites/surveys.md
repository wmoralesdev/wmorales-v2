# Surveys page

## Overview

This document provides instructions for implementing the surveys page. The /surveys and /surveys/:id page allow users to see active surveys and take them.

## General

Surveys are stored in the database and are retrieved from it, they should work as graphs. Users can take surveys and depending on an answer, they can be redirected to a specific section or continuation. The following is an example of a survey (NOT MANDATORY TO BE EXACTLY LIKE THIS):

```json
{
  "id": "1",
  "title": "Survey 1",
  "description": "Survey 1 description",
  "sections": [
    {
      "id": "1",
      "title": "Section 1",
      "description": "Section 1 description",
      "questions": [
        {
          "id": "1",
          "question": "What is your name?",
          "type": "text",
          "options": []
        },
        {
          "id": "2",
          "question": "Are you a developer or investor?",
          "type": "radio",
          "options": [
            {
              "label": "Developer",
              "value": "developer",
              "path": "a"
            },
            {
              "label": "Investor",
              "value": "investor",
              "path": "b"
            }
          ]
        },
      ]
    },
    {
      "id": "2",
      "path": "a",
      "title": "Section 2",
      "description": "Section 2 description",
      "questions": [
        {
          "id": "4",
          "question": "What is your favorite programming language?",
          "type": "text",
          "options": []
        }
      ]
    },
    {
      "id": "3",
      "path": "b",
      "title": "Section 3",
      "description": "Section 3 description",
      "questions": [
        {
          "id": "5",
          "question": "What is your favorite investment?",
          "type": "text",
          "options": []
        }
      ]
    }
  ]
}
```

## UI

### /surveys
The UI should be a simple and clean design, with a header, a list of surveys, and a form for the survey.

### /surveys/:id
The page should be able to render the results of the survey in real time or close to it. This serves as a dashboard for the users who want to see the results.

### /surveys/:id/fill
The page should be able to render the survey and handle the answers from the data retrieved from the database. There should be a rendering engine
for the different types of questions and answers (radio, text, etc). Shadcn/ui components should be used for the UI.


## Tasks
- [ ] Implement the data structure at prisma schema.
- [ ] Create the surveys page route.
- [ ] Add title.
- [ ] Add a list of active surveys.
- [ ] Create the /surveys/:id page.
- [ ] Add a dashboard using shadcn/ui components for the results.
- [ ] Create the /surveys/:id/fill page.
- [ ] Add a form for the survey.
- [ ] Add a rendering engine for the different types of questions and answers (radio, text, etc).
- [ ] Handle the submission of the survey.

## Technical
- Surveys are client side only, at least the fill page should be.
- Use react-hook-form for the form handling.
- Use shadcn/ui components for the UI.
- Use framer motion for the animations.