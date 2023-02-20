import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { NodeService } from '../../../demo/service/NodeService';
import { InputText } from 'primereact/inputtext';

const TreeDemo = () => {
    const [treeNodes, setTreeNodes] = useState([]);
    const [selectedTreeNodeKeys, setSelectedTreeNodeKeys] = useState(null);
    const [treeTableNodes, setTreeTableNodes] = useState([]);
    const [selectedTreeTableNodeKeys, setSelectedTreeTableNodeKeys] = useState([]);

    useEffect(() => {
        const nodeService = new NodeService();
        // nodeService.getTreeNodes().then((data) => setTreeNodes(data));
        nodeService.getTreeTableNodes().then((data) => setTreeTableNodes(data));
    }, []);

    const typeEditor = (options) => {
        return inputTextEditor(options);
    };

    const onEditorValueChange = (options, value) => {
        console.log(options)
        console.log(value)
        let newNodes = JSON.parse(JSON.stringify(treeTableNodes));
        console.log(newNodes)
        let editedNode = findNodeByKey(newNodes, options.node.key);
        console.log(editedNode)

        editedNode.data[options.field] = value;

        setTreeTableNodes(newNodes);
    };

    const findNodeByKey = (nodes, key) => {
        let path = key.split('-');
        let node;

        while (path.length) {
            let list = node ? node.children : nodes;

            node = list[parseInt(path[0], 10)];
            path.shift();
        }

        return node;
    };

    const inputTextEditor = (options) => {
        return <InputText type="text" value={options.rowData[options.field]} onChange={(e) => onEditorValueChange(options, e.target.value)} />;
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Tree</h5>
                    {/* <Tree value={treeNodes} selectionMode="checkbox" selectionKeys={selectedTreeNodeKeys} onSelectionChange={(e) => setSelectedTreeNodeKeys(e.value)} /> */}
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>TreeTable</h5>
                    <TreeTable value={treeTableNodes} header="FileSystem" selectionMode="checkbox" selectionKeys={selectedTreeTableNodeKeys} onSelectionChange={(e) => setSelectedTreeTableNodeKeys(e.value)}>
                        <Column field="name" header="Name" expander />
                        <Column field="size" header="Size" />
                        <Column field="type" editor={typeEditor} header="Type" />
                    </TreeTable>
                </div>
            </div>
        </div>
    );
};

export default TreeDemo;
