/**
 * Copyright 2021 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

 import { useState } from "react";

 import {
   useSession,
 } from "@inrupt/solid-ui-react";

 // Specific imports for querying
 import rdfParser from "rdf-parse";
 import { Store } from "n3"


 import QueryForm from "./queryForm"
 const newEngine = require('@comunica/actor-init-sparql').newEngine;

 

 export default function QueryComponent() {
  const { session } = useSession();
  const { webId } = session.info;

  const [bindings, setBindings] = useState([])


  const executeQuery = async (query, sources) => {


    const queryEngine = newEngine();
    const comunicaSources = []

    for (let sourceFile of sources) {
      const store = new Store();
      const response = await session.fetch(sourceFile, { method: 'get' })
      const textStream = require('streamify-string')(await response.text());
      const contentType = response.headers.get('Content-Type')
      await new Promise((resolve, reject) => {
        rdfParser.parse(textStream, { contentType: contentType.split(';')[0], baseIRI: 'http://example.org' })
        .on('data', (quad) => { console.log('QUAD', quad, store); store.addQuad(quad) })
        .on('error', (error) => reject(error))
        .on('end', async () => {resolve()})
      })
      comunicaSources.push({ type: 'rdfjsSource', value: store })
    }
    
    const result = await queryEngine.query(query, {sources: comunicaSources});

    // Consume results as an array (easier)
    const bindings = await result.bindings();

    // Log metadata containing source-level provenance information
    const metadata = await result.metadata();
    console.log(metadata)

    return bindings
  }

  async function submit(query, sources) {
    const bindings = (await executeQuery(query, sources)) || []
    setBindings(bindings)
  }

  const labelStyle = {
    "width": "50px",
    "marginRight": "20px",
  };  

  function bindingsView(binding) {
    const boundVariables = binding['_root'].entries.map(e => e[0]);
    return (
      <tr>
      { boundVariables.map(variable => {{
        return (
          <tr>
            <div>
              <label style={labelStyle}>{variable}</label> <label>{binding.get(variable).value}</label>
              <br></br>
            </div>
          </tr>
          
        )
      }})}
      </tr>
    )
  }

  return (
    <div>
      <QueryForm webId={webId} submit={submit} />
      <br></br>
      <table>
        <tbody>
          { bindings.map(binding => {
            return(
              <tr>
                {bindingsView(binding)}
              </tr> 
            )
          }
          )}
        </tbody>
      </table>
      <br></br>
      <br></br>
    </div>
  )
}
 