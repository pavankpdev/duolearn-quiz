const sleep = () => {
    return new Promise((res) => setTimeout(res, 3000))
}

module.exports = { sleep }