// One-off cleanup: remove rows created by E2E form-success tests.
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const c = await p.contactMessage.deleteMany({ where: { email: 'test.reviewer@example.edu' } });
  const n = await p.newsletterSubscriber.deleteMany({ where: { email: 'subscriber.test@example.edu' } });
  console.log(`deleted contact: ${c.count}, newsletter: ${n.count}`);
}
main().finally(() => p.$disconnect());
