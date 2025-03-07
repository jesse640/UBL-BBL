function createTrie() {
    let trie = {
            all: {},
            nodes: {}    
    }

    for (let letter = 97; letter <= 122; letter++) {
        let ascii = String.fromCharCode(letter)
        trie.all[ascii] = [];
    }

    return trie;
}

function insert(trie, input) {
    let nodeList = trie.all;
    let node = trie.nodes;
    for (const char of input) {

        // letter doesnt exist
        if (!node[char]) {
            node[char] = {
                letter: char,
                visited: false,
                data: null,
                end: false
            };

            nodeList[char].push(node[char]);
        }

        node = node[char];
    }
    
    node.data = input;
    node.end = true;
}

function searchStartsWith(trie, input) {
    let node = trie.nodes;
    for (const char of input) {
        if (!node[char]) {
            return [];
        }
        node = node[char];
    }

    let results = [];
    getStartsWith(node, results);
    return results;
}

function getStartsWith(node, results) {
    if (node.end) {
        results.push(node.data);
    }

    for (let decimal = 97; decimal <= 122; decimal++) {
        let ascii = String.fromCharCode(decimal);
        if (node[ascii]) {
            getStartsWith(node[ascii], results);
        }
    }
}

function searchContains(trie, input) {
    const firstLetter = input[0];
    const remainingLetters = input.slice(1);

    let exists = true;
    let results = [];

    // for all nodes in in the list
    // eg. for all nodes in the p list ie. p: [node p, node l, ...]
    for (const node of trie.all[firstLetter]) {
        let tempNode = node;
        tempNode.visited = true;

        for (const char of remainingLetters) {
            if (!tempNode[char]) {
                exists = false;
                break;
            } else {
                tempNode[char].visited = true;
                tempNode = tempNode[char];
            }
        }

        if (exists) {
            getContains(tempNode, results);
        }

        exists = true;
    }

    // Reset all nodes
    for (const node of trie.all[firstLetter]) {
        let tempNode = node;
        tempNode.visited = false;

        for (const char of remainingLetters) {
            if (!tempNode[char]) {
                exists = false;
                break;
            } else {
                tempNode[char].visited = false;
                tempNode = tempNode[char];
            }
        }

        if (exists) {
            getContainsReset(tempNode);
        }

        exists = true;
    }

    return results;
}

function getContainsReset(node) {
    node.visited = false;

    for (let decimal = 97; decimal <= 122; decimal++) {
        let ascii = String.fromCharCode(decimal);
        if (node[ascii]) {
            getContainsReset(node[ascii]);
        }
    }
}


function getContains(node, results) {
    if (node.end) {
        results.push(node.data);
    }

    node.visited = true;

    for (let decimal = 97; decimal <= 122; decimal++) {
        let ascii = String.fromCharCode(decimal);
        if (node[ascii] && !node[ascii].visited) {
            getContains(node[ascii], results);
        }
    }
}

// Example usage
let trie = createTrie();
// insert(trie, "apple");
// insert(trie, "app");
// insert(trie, "apricot");
// insert(trie, "ape");
// insert(trie, "appple");
// insert(trie, "apapa");
// insert(trie, "grape");
// insert(trie, "banana");
// insert(trie, "bat");
// insert(trie, "batch");

insert(trie, "grape");
insert(trie, "grapape");
insert(trie, "batch");