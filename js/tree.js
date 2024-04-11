var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
    showTree: true,

    treeLayout: [
        ['a'],
        ['b']
    ]
}

// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
},
)

addLayer("tree-tab", {
    tabFormat: [["tree", function () { return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS) }]],
    previousTab: "",
    leftTab: true,
})