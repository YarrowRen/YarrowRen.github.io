import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

function ColorNode({ data }) {
  return (
    <div style={{ padding: 10 }}>
      <label>Shape Color</label><br />
      <input
        type="color"
        value={data.color}
        onChange={(e) => data.onChange(e.target.value)}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function ShapeTypeNode({ data }) {
  return (
    <div style={{ padding: 10 }}>
      <label>Shape Type</label><br />
      <label><input type="radio" name="shape" value="cube" checked={data.shape === 'cube'} onChange={() => data.onChange('cube')} /> Cube</label><br />
      <label><input type="radio" name="shape" value="pyramid" checked={data.shape === 'pyramid'} onChange={() => data.onChange('pyramid')} /> Pyramid</label>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function ZoomNode({ data }) {
  return (
    <div style={{ padding: 10 }}>
      <label>Zoom Level</label><br />
      <input
        type="range"
        min={1}
        max={5}
        value={data.zoom}
        onChange={(e) => data.onChange(Number(e.target.value))}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function OutputNode({ data }) {
  const shapes = [];

  for (let i = 0; i < 30; i++) {
    const size = 20 * data.zoom;
    const left = Math.random() * 200;
    const top = Math.random() * 200;
    if (data.shape === 'cube') {
      shapes.push(<div key={i} style={{ width: size, height: size, background: data.color, position: 'absolute', top, left }} />);
    } else {
      shapes.push(<div key={i} style={{
        width: 0,
        height: 0,
        borderLeft: `${size}px solid transparent`,
        borderRight: `${size}px solid transparent`,
        borderBottom: `${size * 1.5}px solid ${data.color}`,
        position: 'absolute',
        top, left,
      }} />);
    }
  }

  return (
    <div style={{ width: 250, height: 250, position: 'relative', background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
      <Handle type="target" position={Position.Left} />
      {shapes}
    </div>
  );
}

const nodeTypes = {
  colorNode: ColorNode,
  shapeNode: ShapeTypeNode,
  zoomNode: ZoomNode,
  outputNode: OutputNode,
};

export default function ReactFlowDiagram() {
  const [color, setColor] = useState('#ff0071');
  const [shape, setShape] = useState('pyramid');
  const [zoom, setZoom] = useState(2);

  const initialNodes = [
    {
      id: '1',
      type: 'colorNode',
      position: { x: 0, y: 50 },
      data: { color, onChange: setColor },
    },
    {
      id: '2',
      type: 'shapeNode',
      position: { x: 0, y: 200 },
      data: { shape, onChange: setShape },
    },
    {
      id: '3',
      type: 'zoomNode',
      position: { x: 0, y: 350 },
      data: { zoom, onChange: setZoom },
    },
    {
      id: '4',
      type: 'outputNode',
      position: { x: 350, y: 150 },
      data: { color, shape, zoom },
    },
  ];

  const initialEdges = [
    { id: 'e1-4', source: '1', target: '4', type: 'smoothstep' },
    { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
    { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes.map((node) =>
          node.id === '4'
            ? { ...node, data: { color, shape, zoom } }
            : node.id === '1'
              ? { ...node, data: { color, onChange: setColor } }
              : node.id === '2'
                ? { ...node, data: { shape, onChange: setShape } }
                : { ...node, data: { zoom, onChange: setZoom } }
        )}
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
