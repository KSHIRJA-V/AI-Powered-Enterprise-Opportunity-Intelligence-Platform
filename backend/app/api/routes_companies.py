from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.models import Company
from app.core.schemas import CompanyOut, CompanyCreate

router = APIRouter(prefix="/companies", tags=["Companies"])

DEFAULT_PRESETS = [
    {
        "name": "NVIDIA Corporation",
        "ticker": "NVDA",
        "industry": "Semiconductors and Accelerated Computing",
        "description": "Pioneer in GPU-accelerated computing, AI superclusters, and generative foundation model runtimes.",
        "website": "https://nvidia.com",
        "github_org": "NVIDIA"
    },
    {
        "name": "Tesla, Inc.",
        "ticker": "TSLA",
        "industry": "Autonomous Mobility, Robotics and Energy",
        "description": "Vertically integrated electric vehicle, full self-driving neural net, and energy storage platform.",
        "website": "https://tesla.com",
        "github_org": "teslamotors"
    },
    {
        "name": "JPMorgan Chase & Co.",
        "ticker": "JPM",
        "industry": "Global Banking and Financial Services",
        "description": "Global financial institution modernizing hybrid core banking, AI risk underwriting, and wealth platforms.",
        "website": "https://jpmorganchase.com",
        "github_org": "jpmorganchase"
    },
    {
        "name": "Walmart Inc.",
        "ticker": "WMT",
        "industry": "Retail and Autonomous Supply Chain",
        "description": "Omnichannel retail enterprise deploying automated distribution, predictive inventory, and edge vision.",
        "website": "https://walmart.com",
        "github_org": "walmartlabs"
    },
    {
        "name": "Siemens AG",
        "ticker": "SIEGY",
        "industry": "Industrial Automation and Digital Enterprise",
        "description": "Industrial engineering leader scaling connected digital manufacturing twins, IoT edge, and grid software.",
        "website": "https://siemens.com",
        "github_org": "siemens"
    },
    {
        "name": "ASML Holding N.V.",
        "ticker": "ASML",
        "industry": "Semiconductor Photolithography Systems",
        "description": "Critical global supplier of Extreme Ultraviolet (EUV) photolithography systems for semiconductor fabrication.",
        "website": "https://asml.com",
        "github_org": "asml-labs"
    }
]

@router.get("/presets", response_model=List[CompanyCreate])
async def get_preset_companies():
    return DEFAULT_PRESETS

@router.get("/", response_model=List[CompanyOut])
async def list_companies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Company).order_by(Company.name))
    companies = result.scalars().all()
    if not companies:
        # Seed default presets into DB
        for p in DEFAULT_PRESETS:
            comp = Company(**p)
            db.add(comp)
        await db.commit()
        result = await db.execute(select(Company).order_by(Company.name))
        companies = result.scalars().all()
    return companies

@router.post("/", response_model=CompanyOut)
async def create_company(company_in: CompanyCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Company).where(Company.name == company_in.name))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Company already registered")
    comp = Company(**company_in.model_dump())
    db.add(comp)
    await db.commit()
    await db.refresh(comp)
    return comp
