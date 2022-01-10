'use strict'
const config = require('conventional-changelog-conventionalcommits');

module.exports = config({
    "types": [
        { type: 'feat', section: 'Features' },
        { type: 'fix', section: 'Bug Fixes' },
        { type: 'perf', section: 'Performance' },
        { type: 'revert', section: 'Reverts' },
        { type: 'chore', section: 'Chores' },
        { type: 'build', section: 'Build System', hidden: true },
        { type: 'ci', section: 'Continuous Integration', hidden: true },
        { type: 'refactor', section: 'Code Refactoring', hidden: true },
        { type: 'docs', section: 'Documentation', hidden: true },
        { type: 'style', section: 'Styles', hidden: true },
        { type: 'test', section: 'Tests', hidden: true },
        { type: 'wip', section: 'WIP', hidden: true },
        { type: 'hide', section: 'Hidden', hidden: true },
        { type: 'release', section: 'Releases', hidden: true },
    ]
})
