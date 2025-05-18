import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/flow-animation.css';
import '../styles/CustomNode.css'; // ✅ 样式文件
import yaml from 'js-yaml';
import { NODE_COLORS, TITLE_COLORS, MAX_DESC_LENGTH } from '../config/nodeConfig';

// ------------------------
// 自定义节点组件
// ------------------------
function CustomNode({ data }) {
  const backgroundColor = NODE_COLORS[data.type] || NODE_COLORS.default;
  const titleColor = TITLE_COLORS[data.type] || TITLE_COLORS.default;

  const shortDesc = data.desc?.length > MAX_DESC_LENGTH
    ? data.desc.slice(0, MAX_DESC_LENGTH) + '...'
    : data.desc;

  const hasModel = data.modelName;
  const hasParams = Array.isArray(data.parameters) && data.parameters.length > 0;

  return (
    <div className="custom-node" style={{ background: backgroundColor }}>
      <strong className="custom-node-title" style={{ color: titleColor }}>
        {data.title || 'Unnamed'}
      </strong>
      <div className="custom-node-type">
        <em>Type: {data.type}</em>
      </div>

      {shortDesc && <div className="custom-node-desc">{shortDesc}</div>}

      {hasModel && <div className="custom-node-model">Model: {data.modelName}</div>}

      {hasParams && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          {data.parameters.map((param) => {
            const name = typeof param === 'object' ? param.key : param;
            const value = typeof param === 'object' ? param.value : undefined;

            return (
              <div className="custom-node-tag" key={name}>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {name?.toUpperCase()}
                </span>
                {value != null && (
                  <span className="custom-node-tag-value">{String(value)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Handle type="target" position={Position.Left} style={{ background: '#888' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#888' }} />
    </div>
  );
}

const nodeTypes = {
  customNode: CustomNode,
};

// ------------------------
// 主组件
// ------------------------
export default function ReactFlowDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const yamlFilePath = '/assets/DeepResearch.yml';

  useEffect(() => {
    async function fetchAndParseYAML() {
      try {
        const response = await fetch(yamlFilePath);
        const yamlText = await response.text();
        const parsed = yaml.load(yamlText);

        const graph = parsed.workflow?.graph;
        if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
          console.error("Invalid or missing graph structure");
          return;
        }

        function extractTextFromTree(node) {
          let texts = [];
          if (Array.isArray(node)) {
            node.forEach((n) => texts.push(...extractTextFromTree(n)));
          } else if (typeof node === 'object' && node !== null) {
            if (typeof node.text === 'string') {
              texts.push(node.text.trim());
            }
            Object.values(node).forEach((child) => {
              texts.push(...extractTextFromTree(child));
            });
          }
          return texts;
        }

        const convertedNodes = graph.nodes.map((node) => {
          const rawData = node.data ?? {};
          const type = rawData.type ?? node.type ?? 'unknown';
          let title = rawData.title ?? 'Unnamed';
          let desc = rawData.desc ?? '';

          if (node.type === 'custom-note' || type === 'custom-note') {
            try {
              const noteJson = JSON.parse(rawData.text || '{}');
              const textItems = extractTextFromTree(noteJson?.root?.children || []);
              desc = textItems.join('\n');
              title = textItems[0]?.slice(0, 20) || '笔记';
            } catch (e) {
              console.warn('Failed to parse note text:', e);
              desc = '[无法解析笔记内容]';
            }
          }

          const variables = rawData.variables || [];
          const paramPairs = variables.map(v => ({
            key: v.variable || v.label || '',
            value: undefined,
          }));

          const modelName = type === 'llm' ? (rawData?.model?.name || '') : '';

          if (type === 'tool') {
            const toolConf = rawData?.tool_configurations || {};
            Object.entries(toolConf || {}).forEach(([k, v]) => {
              paramPairs.push({ key: k, value: v });
            });
          }

          const nodeId = String(node.id); // ⚠️ 强制字符串以避免非法 ID

          return {
            id: nodeId,
            type: 'customNode',
            position: node.position || { x: 0, y: 0 },
            data: {
              title,
              type,
              desc,
              width: node.width,
              height: node.height,
              modelName,
              parameters: paramPairs,
            },
          };
        });

        const convertedEdges = graph.edges.map((edge) => ({
          id: String(edge.id),
          source: String(edge.source),
          target: String(edge.target),
          type: 'bezier',
          style: {
            stroke: '#4a5568',
            strokeWidth: 2,
            strokeDasharray: '6 4',
            animation: 'dash-flow 1.5s linear infinite',
          },
        }));

        setNodes(convertedNodes);
        setEdges(convertedEdges);
      } catch (err) {
        console.error('Failed to load YAML:', err);
      }
    }

    fetchAndParseYAML();
  }, []);

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
}
