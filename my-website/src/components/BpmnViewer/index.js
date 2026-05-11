import React, { useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function BpmnViewerInner({ file }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const { siteConfig } = useDocusaurusContext();

  // baseUrl всегда заканчивается на '/', file не начинается с '/'
  // Итог локально:  '/' + 'media-and-data/process.bpmn' = '/media-and-data/process.bpmn'
  // Итог на gh-pages: '/sa_documentation/' + 'media-and-data/process.bpmn' = '/sa_documentation/media-and-data/process.bpmn'
  const fileUrl = `${siteConfig.baseUrl}${file}`;

  useEffect(() => {
    async function loadBpmn() {
      const BpmnJS = (await import('bpmn-js')).default;
      await import('bpmn-js/dist/assets/diagram-js.css');
      await import('bpmn-js/dist/assets/bpmn-js.css');
      await import('bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css');

      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      const viewer = new BpmnJS({ container: containerRef.current });
      viewerRef.current = viewer;

      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const xml = await response.text();
        await viewer.importXML(xml);
        viewer.get('canvas').zoom('fit-viewport');
      } catch (err) {
        console.error('Ошибка загрузки BPMN:', err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:13px;padding:1rem;text-align:center;">
              Не удалось загрузить диаграмму.<br/>URL: ${fileUrl}
            </div>`;
        }
      }
    }

    loadBpmn();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [fileUrl]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '600px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
      }}
    />
  );
}

export default function BpmnViewer({ file }) {
  return (
    <BrowserOnly fallback={
      <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
        Загрузка диаграммы...
      </div>
    }>
      {() => <BpmnViewerInner file={file} />}
    </BrowserOnly>
  );
}
