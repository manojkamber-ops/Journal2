'use client';

import { useHashRoute } from '@/lib/journal-client';
import { Header } from '@/components/journal/header';
import { Footer } from '@/components/journal/footer';
import { HomeView } from '@/components/journal/views/home';
import { ArticlesView } from '@/components/journal/views/articles';
import { ArticleView } from '@/components/journal/views/article';
import { IssuesView } from '@/components/journal/views/issues';
import { IssueView } from '@/components/journal/views/issue';
import { BoardView } from '@/components/journal/views/board';
import { AuthorsView } from '@/components/journal/views/authors';
import { AboutView } from '@/components/journal/views/about';
import { ContactView } from '@/components/journal/views/contact';
import { ErrorBox } from '@/components/journal/bits';

export default function Page() {
  const route = useHashRoute();

  const render = () => {
    switch (route.path) {
      case 'home':
        return <HomeView />;
      case 'articles':
        return (
          <ArticlesView
            key={`articles|${route.params.toString()}`}
            initialQuery={route.params.get('q') ?? undefined}
            initialSection={route.params.get('section') ?? undefined}
            initialSort={route.params.get('sort') ?? undefined}
            initialYear={route.params.get('year') ?? undefined}
          />
        );
      case 'article':
        return route.id ? <ArticleView id={route.id} /> : <NotFound />;
      case 'issues':
        return <IssuesView />;
      case 'issue':
        return route.id ? <IssueView id={route.id} /> : <NotFound />;
      case 'editorial-board':
        return <BoardView />;
      case 'for-authors':
        return <AuthorsView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header route={route} />
      <main className="flex-1" id="main-content">
        {render()}
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <ErrorBox message="The page you requested does not exist. Use the navigation above to return to the journal." />
    </div>
  );
}
