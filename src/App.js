import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [webhookStatus, setWebhookStatus] = useState('inactive');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [socket, setSocket] = useState(null);

  // Sample webhook data from Contentstack
  const sampleWebhookData = {
    module: "entry",
    api_key: "blt04b62eff2051e343",
    event: "publish",
    bulk: false,
    data: {
      locale: "en-us",
      status: "success",
      action: "publish",
      entry: {
        uid: "bltd90d9472c066fe05",
        deleted_at: false,
        _version: 4,
        locale: "en-us",
        _in_progress: false,
        created_at: "2025-08-19T10:42:56.356Z",
        created_by: "blt53a136de1f5c92ef",
        page_components: [
          {
            section_with_cards: {
              section_title: "ggwp",
              _metadata: { uid: "cs150fb860a81eeefb" },
              section_description: "ggwp",
              cards: [
                {
                  card_title_h3: "ggwp",
                  _metadata: { uid: "csbfeafe5e19fd9ab0" },
                  description: "ggwp",
                  call_to_action: { title: "ggwp", href: "ggwp" },
                  image: null
                }
              ]
            }
          }
        ],
        seo: {
          meta_title: "ggwp",
          meta_description: "ggpw",
          keywords: "ggpw",
          enable_search_indexing: true
        },
        tags: ["ggwp"],
        title: "ggwpgggedd",
        updated_at: "2025-08-20T08:26:18.987Z",
        updated_by: "blt53a136de1f5c92ef",
        url: "/ggwpd",
        publish_details: {
          environment: "blt671eb8c28f523256",
          locale: "en-us",
          time: "2025-08-20T08:26:21.432Z",
          user: "blt53a136de1f5c92ef"
        },
        content_type: {
          title: "FAQs",
          uid: "faqs",
          schema: [
            {
              display_name: "Title",
              uid: "title",
              data_type: "text",
              mandatory: true,
              unique: true,
              field_metadata: { _default: true, version: 3 },
              multiple: false,
              non_localizable: false,
              indexed: false,
              inbuilt_model: false
            },
            {
              display_name: "URL",
              uid: "url",
              data_type: "text",
              mandatory: false,
              field_metadata: { _default: true, version: 3 },
              multiple: false,
              unique: false,
              non_localizable: false,
              indexed: false,
              inbuilt_model: false
            }
          ],
          options: {
            is_page: true,
            singleton: false,
            title: "title",
            sub_title: [],
            url_pattern: "/:title",
            url_prefix: "/"
          }
        },
        environment: {
          name: "dev",
          api_key: "blt04b62eff2051e343"
        },
        branch: {
          uid: "main"
        }
      },
      triggered_at: "2025-08-20T08:26:21.636Z"
    }
  };

  useEffect(() => {
    // Generate webhook URL when component mounts
    const currentUrl = window.location.origin;
    
    // Use production URL if deployed, otherwise use localhost
    if (currentUrl.includes('contentstackapps.com')) {
      setWebhookUrl('https://semanticsearch.contentstackapps.com/api/webhook');
    } else {
      setWebhookUrl(`${currentUrl}/webhook`);
    }
    
    // Initialize Socket.IO connection
    const newSocket = io(currentUrl);
    setSocket(newSocket);
    
    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setWebhookStatus('active');
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setWebhookStatus('inactive');
    });
    
    newSocket.on('entries', (existingEntries) => {
      setEntries(existingEntries);
    });
    
    newSocket.on('newEntry', (newEntry) => {
      setEntries(prevEntries => [newEntry, ...prevEntries]);
    });
    
    newSocket.on('entriesCleared', () => {
      setEntries([]);
    });
    
    // Check if webhook endpoint is accessible
    checkWebhookStatus();
    
    // Poll for webhook status every 30 seconds
    const interval = setInterval(checkWebhookStatus, 30000);
    
    return () => {
      clearInterval(interval);
      newSocket.close();
    };
  }, []);

  const checkWebhookStatus = async () => {
    try {
      const response = await fetch('/api/webhook/status');
      if (response.ok) {
        setWebhookStatus('active');
      } else {
        setWebhookStatus('inactive');
      }
    } catch (error) {
      setWebhookStatus('inactive');
    }
  };

  const clearEntries = () => {
    setEntries([]);
  };

  const addSampleData = () => {
    const sampleEntry = {
      ...sampleWebhookData,
      timestamp: new Date().toISOString(),
      received_at: new Date().toLocaleString()
    };
    setEntries(prevEntries => [sampleEntry, ...prevEntries]);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderEntryContent = (entry) => {
    if (entry.data && entry.data.entry) {
      const entryData = entry.data.entry;
      return (
        <div className="entry-details">
          <div className="entry-basic-info">
            <h4>Entry Details</h4>
            <p><strong>Title:</strong> {entryData.title}</p>
            <p><strong>UID:</strong> {entryData.uid}</p>
            <p><strong>Content Type:</strong> {entryData.content_type?.title} ({entryData.content_type?.uid})</p>
            <p><strong>URL:</strong> {entryData.url}</p>
            <p><strong>Status:</strong> {entryData.publish_details?.environment?.name}</p>
            <p><strong>Created:</strong> {formatTimestamp(entryData.created_at)}</p>
            <p><strong>Updated:</strong> {formatTimestamp(entryData.updated_at)}</p>
          </div>
          
          {entryData.page_components && entryData.page_components.length > 0 && (
            <div className="entry-components">
              <h4>Page Components</h4>
              {entryData.page_components.map((component, index) => (
                <div key={index} className="component-item">
                  {Object.keys(component).map(key => (
                    <div key={key}>
                      <strong>{key}:</strong> {JSON.stringify(component[key], null, 2)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {entryData.seo && (
            <div className="entry-seo">
              <h4>SEO</h4>
              <p><strong>Meta Title:</strong> {entryData.seo.meta_title}</p>
              <p><strong>Meta Description:</strong> {entryData.seo.meta_description}</p>
              <p><strong>Keywords:</strong> {entryData.seo.keywords}</p>
              <p><strong>Search Indexing:</strong> {entryData.seo.enable_search_indexing ? 'Enabled' : 'Disabled'}</p>
            </div>
          )}
          
          <div className="entry-raw-data">
            <h4>Raw Webhook Data</h4>
            <pre>{JSON.stringify(entry, null, 2)}</pre>
          </div>
        </div>
      );
    }
    
    // Fallback to raw JSON if structure is different
    return (
      <div className="entry-content">
        {JSON.stringify(entry, null, 2)}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>Contentstack Webhook App</h1>
          <p>Real-time entry updates from Contentstack</p>
        </div>

        <div className="webhook-status">
          <h3>
            <span className={`status-indicator status-${webhookStatus}`}></span>
            Webhook Status: {webhookStatus === 'active' ? 'Active' : 'Inactive'}
          </h3>
          <p>Use this URL in your Contentstack webhook configuration:</p>
          <div className="webhook-url">{webhookUrl}</div>
          <p>
            <strong>Production URL:</strong> <code>https://semanticsearch.contentstackapps.com/api/webhook</code>
          </p>
          <p>
            <strong>Note:</strong> Make sure your backend server is running to receive webhook calls.
          </p>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button 
            onClick={addSampleData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Add Sample Webhook Data
          </button>
          <button 
            onClick={clearEntries}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All Entries
          </button>
        </div>

        <div className="entries-container">
          {entries.length === 0 ? (
            <div className="no-entries">
              <h3>No entries received yet</h3>
              <p>Click "Add Sample Webhook Data" to see how Contentstack webhook data will be displayed</p>
              <p>Or wait for real webhooks from Contentstack</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div key={index} className="entry-card">
                <div className="entry-header">
                  <div className="entry-title">
                    {entry.event === 'publish' ? 'Entry Published' : 
                     entry.event === 'unpublish' ? 'Entry Unpublished' : 
                     entry.event === 'update' ? 'Entry Updated' : 
                     entry.event || 'Entry Update'}
                  </div>
                  <div className="entry-meta">
                    {formatTimestamp(entry.timestamp || entry.data?.triggered_at || Date.now())}
                  </div>
                </div>
                {renderEntryContent(entry)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;



