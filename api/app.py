from fastapi import FastAPI
from api.routers import feedback, reports, health, summary, dashboard
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI(title="Feedback Intelligence System")

# Routers
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(summary.router, prefix="/summary", tags=["Summary"]) 
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])



# Allow Next.js frontend to call FastAPI
origins = [
    "http://localhost:3000",   # Next.js dev server
    "https://feeld-digest.lovable.app",  # your deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],          # allow GET, POST, OPTIONS, etc.
    allow_headers=["*"],          # allow all headers
)

# then include your routers
# app.include_router(feedback.router)
# app.include_router(reports.router)
# app.include_router(summary.router)
