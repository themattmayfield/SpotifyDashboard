import { createFileRoute, notFound } from '@tanstack/react-router';
import { Recap } from './recap';

export const Route = createFileRoute('/_spotify/recap/$month')({
  beforeLoad: ({ params }) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(params.month)) throw notFound();
  },
  component: MonthRecap,
});
function MonthRecap() {
  return <Recap month={Route.useParams().month} />;
}
