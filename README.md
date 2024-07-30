# Full Stack Engineer - Technical Challenge

## Table of contents

- [Overview](#overview)
- [Tech and Tools used](#tech-and-tools-used)

## Overview

### Tech and Tools used
Frontend:
- Typescript
- React.js
- Redux + Redux Toolkit
- RTK Query
- shadcn
- react-hook-form
    
Backend:
- Node.js 
- Express
- PSQL
- Drizzle


### Requirements

#### Add invoice with autocomplete for product input

- [ ] POST request to Save data to DB

  - Invoice Data
    - date
    - customer name
    - salesperson name
    - notes (optional)
    - multiple products sold

- [ ] Autocomplete/Suggestion As user types

  - Build as combobox and maybe pending UI while fetching
  - suggestion should include
    - product name
    - product picture
    - stock
    - price of the product

- [ ] All input fields are required to enable form submit
  - by default button is disabled
- [ ] Validate input and show error message for invalid field
  - put error under the related invalid field
- [ ] UI Feedback for successful request
  - show toast or sonner
  - Reset fields

#### Display Invoice Cards

- [ ] implement pagination to show invoices that have been published
- [ ] Displayed Data
  - customer name
  - salesperson name
  - total amount paid
  - notes
- [ ] Queried with GET/ Request using lazy loading method

#### Time-series graph

- [ ] Show a graph to project revenue from invoices for daily, weekly, and monthly
  - Could be multiple graphs for each time frame or single graph with all timeframe
- [ ] should be able to pan and zoom to specific period
- [ ] auto scroll when data is pushed
  - maybe polling/websocket?
