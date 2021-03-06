/**
 *
 * ArticlePage
 *
 */

import React from 'react';
import environment from 'relay/environment';

// types
import { RouteComponentProps } from 'react-router-dom';
import { ArticlePageQuery } from 'relay/artifacts/ArticlePageQuery.graphql';

// containers
import { graphql, QueryRenderer } from 'react-relay';
import Article from 'containers/Article';

// components
import Err from 'components/Err';
import Spinner from 'components/Spinner';
import NotFound from 'components/NotFound';

class ArticlePage extends React.Component<RouteComponentProps<{ id: string }>> {
  public render() {
    const { match } = this.props;

    return (
      <QueryRenderer<ArticlePageQuery>
        environment={environment}
        query={graphql`
          query ArticlePageQuery($id: ID!) {
            article(id: $id) {
              ...Article_article
            }
          }
        `}
        variables={{ id: match.params.id }}
        render={({ error, retry, props }) => {
          if (error) {
            return <Err error={error} onRetry={retry} />;
          }

          if (!props) {
            return <Spinner />;
          }

          if (!props.article) {
            return <NotFound />;
          }

          return <Article article={props.article} />;
        }}
      />
    );
  }
}

export default ArticlePage;
