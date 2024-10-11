const ignoreList = [
    "resizeobserver-loop-limit-exceeded",
    "useRequest has caught the exception if you need to handle the exception yourself, you can set options.throwOnError to true.",
    function (message, event, originEvent) {
        if (originEvent.type === 'unhandledrejection' && originEvent.reason && originEvent.reason.name === 'BizError') {
            return true;
        }
        return false;
    },
    /^The play\(\) request was interrupted by a/,
    "Failed to execute 'transaction' on 'IDBDatabase': The database connection is closing.",
];
export default ignoreList;