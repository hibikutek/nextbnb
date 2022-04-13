import { User } from "../../../model";

const { crypto } = require('crypto')

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).end()
        return
    }

    const { email, password, passwordconfirmation } = req.body
    if (password !== passwordconfirmation) {
        res.end(JSON.stringify({status: 'error', message: 'Passwords do not match'}))
        return
    }
    let user = await User.findOne({where: { email }})

    if (!user) {
        user = await User.create({email, password});

        const sessionToken = crypto.randomBytes(255).toString('hex')
        console.log(sessionToken)
        const d = new Date()
        d.setDate(d.getDate() + 30)
        User.update(
            {
                session_token: sessionToken,
                session_expiration: d
            },
            { where: { email } }
        )
        res.end(JSON.stringify({status: 'success', message: 'User added'}))
    }
    else {
        res.end(JSON.stringify({status: 'error', message: 'User already exists'}))

    }
}

