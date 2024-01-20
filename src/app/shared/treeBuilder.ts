import * as _ from 'lodash';

export const createTree = (arr: any, param: string): any => {
    // console.log('create tree..');
    const nodes = {};
    // console.log('arr createTree : ', arr);

    return arr.filter(function (obj) {
        // const id = obj['id'], parentId = obj['parentId'];
        // const id = obj['value'], parentId = obj['parentId'];
        const id = obj[param], parentId = obj['parentId'];

        nodes[id] = _.defaults(obj, nodes[id], { children: [] });
        // tslint:disable-next-line:no-unused-expression
        parentId && (nodes[parentId] = (nodes[parentId] || { children: [] }))['children'].push(obj);

        return !parentId;
    });
};

export const levelAndSort = (data: any, startingLevel: number) => {
    // indexes
    const indexed = {};        // the original values
    const nodeIndex = {};      // tree nodes
    let i;
    for (i = 0; i < data.length; i++) {
        const id = data[i].id;
        const xnode = {
            id: id,
            level: startingLevel,
            children: [],
            sorted: false
        };
        indexed[id] = data[i];
        nodeIndex[id] = xnode;
    }

    // populate tree
    for (i = 0; i < data.length; i++) {
        const node = nodeIndex[data[i].id];
        let pNode = node;
        let j;
        let nextId = indexed[pNode.id].parentId;
        for (j = 0; nextId in nodeIndex; j++) {
            pNode = nodeIndex[nextId];
            if (j === 0) {
                pNode.children.push(node.id);
            }
            node.level++;
            nextId = indexed[pNode.id].parentId;
        }
    }

    // extract nodes and sort-by-level
    const nodes = [];
    // tslint:disable-next-line:forin
    for (const key in nodeIndex) {
        nodes.push(nodeIndex[key]);
    }
    nodes.sort(function (a, b) {
        return a.level - b.level;
    });

    // refine the sort: group-by-siblings
    const retval = [];
    for (i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const parentId = indexed[node.id].parentId;
        if (parentId in indexed) {
            const pNode = nodeIndex[parentId];
            let j;
            for (j = 0; j < pNode.children.length; j++) {
                const child = nodeIndex[pNode.children[j]];
                if (!child.sorted) {
                    indexed[child.id].level = child.level;
                    retval.push(indexed[child.id]);
                    child.sorted = true;
                }
            }
        } else if (!node.sorted) {
            indexed[node.id].level = node.level;
            retval.push(indexed[node.id]);
            node.sorted = true;
        }
    }
    return retval;
};
