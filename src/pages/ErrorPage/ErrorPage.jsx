import { useRouteError } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
export default function ErrorPage() {
    const error = useRouteError();
    console.log(error);
    return (
        <div id='error-page'>
            <Helmet>
                <title>Khóa học | LMS-DEF-NM</title>
            </Helmet>
            <h1>Opps!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}