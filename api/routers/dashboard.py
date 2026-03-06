from fastapi import APIRouter, Query
from api.services import supabase

router = APIRouter()

@router.get("/dashboard/reports")
async def dashboard_reports(
    start_date: str = Query(..., description="Start date YYYY-MM-DD"),
    end_date: str = Query(..., description="End date YYYY-MM-DD")
):
    reports = await supabase.get_reports_in_range(start_date, end_date)
    if not reports:
        return {"message": "No reports found in this range."}
    return {"reports": reports, "count": len(reports)}

