'use strict';

function alpineData() {
    return {
        date: new Date().getFullYear(),
        background: {
            get: ['text-bg-primary', 'bg-primary-subtle'],
            post: ['text-bg-success', 'bg-success-subtle'],
            patch: ['text-bg-warning', 'bg-warning-subtle'],
            delete: ['text-bg-danger', 'bg-danger-subtle'],
        },
        alpineInit: function () {
            if (new Date().getFullYear() > 2018) this.date = '2018 - ' + this.date;
            hljs.highlightAll();
        },
    }
}
