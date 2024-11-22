"use strict"

module.exports = {

    isLogin: (req, res, next) => {

        if (!(req.user && req.user.isActive)) {
            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login.')
        }
        next()
    },
}
