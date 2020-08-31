import jwt from 'jsonwebtoken'

import { sendCodeToEmail, generateRandomCode } from '../../../utils'
import { User } from '../../../models'
import { emailSchema } from '../../validators/user.validators'

export default async (req, res, next) => {
  const { email } = req.body
  const confirmCode = generateRandomCode(6)

  try {
    await emailSchema.validateAsync(req.body)

    /* @TODO: invalid e-mail check */

    if (!email) {
      const err = new Error('You can not leave fields empty')
      err['status'] = 400
      return next(err)
    }

    const existingEmailCount = await User.countDocuments({ email })
    if (existingEmailCount) {
      const err = new Error('This e-mail address already registered')
      err['status'] = 403
      return next(err)
    }

    console.log(confirmCode)
    /* await sendCodeToEmail({email, confirmCode}); */
    const token = await jwt.sign({ confirmCode }, process.env.JWT_SECRET_KEY)
    return res.status(200).json({ token })
  }
  catch (err) {
    return next(err)
  }
}