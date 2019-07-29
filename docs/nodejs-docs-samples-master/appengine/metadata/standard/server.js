/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const express = require('express');
const request = require('got');

const app = express();
app.enable('trust proxy');

const METADATA_PROJECT_ID_URL =
  'http://metadata.google.internal/computeMetadata/v1/project/project-id';

const getProjectId = () => {
  const options = {
    headers: {
      'Metadata-Flavor': 'Google',
    },
  };

  return request(METADATA_PROJECT_ID_URL, options);
};

app.get('/', async (req, res, next) => {
  try {
    const response = await getProjectId();
    const projectId = response.body;
    res
      .status(200)
      .send(`Project ID: ${projectId}`)
      .end();
  } catch (error) {
    if (error && error.statusCode && error.statusCode !== 200) {
      console.log('Error while talking to metadata server.');
    }
    next(error);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
