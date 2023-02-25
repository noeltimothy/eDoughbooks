import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

function Home() {
  const title = 'eDoughBooks';

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <main className="container-fluid">
        <div className="px-4 py-5 my-5 text-center">
          <h1 className="display-5 fw-bold">{title}</h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">
              A one stop system for daily pizza management.
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <button type="button"
                      className="btn btn-primary btn-lg px-4 gap-3"
                      onClick={() => navigate('/login')}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
