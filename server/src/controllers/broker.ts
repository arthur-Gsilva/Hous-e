import { Request, Response } from 'express'
import { sendMessage } from '../broker/producer.js'

export async function sendMessageController(req: Request, res: Response) {
  try {
    const { key, value } = req.query

    await sendMessage(
      (key as string) || 'default-key',
      (value as string) || 'Hello from Express!'
    )

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao enviar mensagem' })
  }
}
