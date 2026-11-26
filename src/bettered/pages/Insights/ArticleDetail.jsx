import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '@/bettered/lib/useDocumentTitle';
import { Container, Eyebrow, BEButton, Breadcrumbs } from '@/bettered/components/ui';
import { getArticleBySlug, articles } from '@/bettered/data/articles';

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  useDocumentTitle(article ? article.title : 'Insights', article ? article.subtitle : undefined);

  if (!article) return <Navigate to="/insights" replace />;

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="bg-bettered-ink text-white">
        <Container className="py-14 sm:py-20 max-w-3xl">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights' }, { label: article.title }]} />
          <Eyebrow>{article.category}</Eyebrow>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">{article.title}</h1>
          <p className="mt-4 text-white/80 text-lg leading-relaxed">{article.subtitle}</p>
          <p className="mt-6 text-sm text-white/60 font-semibold">
            {article.author} &middot; {formattedDate} &middot; {article.readingTime}
          </p>
        </Container>
      </div>

      <Container className="py-16 max-w-3xl">
        <article className="space-y-6 text-lg text-bettered-charcoal/85 leading-relaxed">
          {article.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>

        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-bettered-lightgray">
            <h2 className="text-xl font-black tracking-tight mb-5">More Insights</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((a) => (
                <BEButton
                  key={a.slug}
                  to={`/insights/${a.slug}`}
                  variant="ghost"
                  className="!justify-start !normal-case !font-normal border border-bettered-lightgray rounded-xl p-5 text-left block"
                >
                  <span className="block">
                    <span className="block text-xs font-bold uppercase tracking-wide text-bettered-orange mb-2">{a.category}</span>
                    <span className="block font-bold text-bettered-ink leading-snug">{a.title}</span>
                  </span>
                </BEButton>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 rounded-2xl bg-bettered-offwhite p-8 text-center">
          <h2 className="text-xl font-black tracking-tight mb-4">See where your school stands.</h2>
          <BEButton to="/school-health-index/start" variant="dark">
            Take the School Health Index <ArrowRight className="h-4 w-4" />
          </BEButton>
        </div>
      </Container>
    </div>
  );
}
