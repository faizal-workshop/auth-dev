'use strict';

function alpineData() {
    return {
        background: {
            get: ['text-bg-primary', 'bg-primary-subtle'],
            post: ['text-bg-success', 'bg-success-subtle'],
            patch: ['text-bg-warning', 'bg-warning-subtle'],
            delete: ['text-bg-danger', 'bg-danger-subtle'],
        },
        alpineInit: function () {
        },
    }
}
