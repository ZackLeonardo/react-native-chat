import { Children } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose, withContext } from "recompose";

/**
 * Creates a translation context, available to its children
 *
 * Must be called withing a Redux app.
 *
 * @example
 *     const MyApp = () => (
 *         <Provider store={store}>
 *             <TranslationProvider locale="fr">
 *                 <!-- Child components go here -->
 *             </TranslationProvider>
 *         </Provider>
 *     );
 */
const TranslationProvider = ({ children }) => Children.only(children);

TranslationProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  children: PropTypes.element
};

const mapStateToProps = state => ({
  locale: state.i18n.locale
});

const withI18nContext = withContext(
  {
    locale: PropTypes.string.isRequired
  },
  ({ locale }) => {
    return {
      locale
    };
  }
);

export default compose(
  connect(mapStateToProps),
  withI18nContext
)(TranslationProvider);
