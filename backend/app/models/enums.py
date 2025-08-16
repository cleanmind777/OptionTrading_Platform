from enum import Enum, IntEnum

class TransactionTypeEnum(str, Enum):
    TRADE = "TRADE"
    RECEIVE_AND_DELIVER = "RECEIVE_AND_DELIVER"
    DIVIDEND_OR_INTEREST = "DIVIDEND_OR_INTEREST"
    ACH_RECEIPT = "ACH_RECEIPT"
    ACH_DISBURSEMENT = "ACH_DISBURSEMENT"
    CASH_RECEIPT = "CASH_RECEIPT"
    CASH_DISBURSEMENT = "CASH_DISBURSEMENT"
    ELECTRONIC_FUND = "ELECTRONIC_FUND"
    WIRE_OUT = "WIRE_OUT"
    WIRE_IN = "WIRE_IN"
    JOURNAL = "JOURNAL"
    MEMORANDUM = "MEMORANDUM"
    MARGIN_CALL = "MARGIN_CALL"
    MONEY_MARKET = "MONEY_MARKET"
    SMA_ADJUSTMENT = "SMA_ADJUSTMENT"
    
class ContractTypeEnum(str, Enum):
    CALL = "CALL"
    PUT = "PUT"
    ALL = "ALL"
    
class OptionStrategyEnum(str, Enum):
    SINGLE = "SINGLE"
    ANALYTICAL = "ANALYTICAL"
    COVERED = "COVERED"
    VERTICAL = "VERTICAL"
    CALENDAR = "CALENDAR"
    STRANGLE = "STRANGLE"
    STRADDLE = "STRADDLE"
    BUTTERFLY = "BUTTERFLY"
    CONDOR = "CONDOR"
    DIAGONAL = "DIAGONAL"
    COLLAR = "COLLAR"
    ROLL = "ROLL"

class EntitlementEnum(str, Enum):
    PN = "PN"
    NP = "NP"
    PP = "PP"

class PeriodTypeEnum(str, Enum):
    day = "day"
    month = "month"
    year = "year"
    ytd = "ytd"
    
class FrequencyTypeEnum(str, Enum):
    minute = "minute"
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    
class FrequencyEnum(IntEnum):
    zero = 0
    one = 1
    five = 5
    ten = 10
    thirty = 30
    sixty = 60
    
class SymbolIdEnum(str, Enum):
    DJI = "$DJI"
    COMPX = "$COMPX"
    SPX = "$SPX"
    NYSE = "NYSE"
    NASDAQ = "NASDAQ"
    OTCBB = "OTCBB"
    INDEX_ALL = "INDEX_ALL"
    EQUITY_ALL = "EQUITY_ALL"
    OPTION_ALL = "OPTION_ALL"
    OPTION_PUT = "OPTION_PUT"
    OPTION_CALL = "OPTION_CALL"
    
class SortEnum(str, Enum):
    VOLUME = "VOLUME"
    TRADES = "TRADES"
    PERCENT_CHANGE_UP = "PERCENT_CHANGE_UP"
    PERCENT_CHANGE_DOWN = "PERCENT_CHANGE_DOWN"
    
class MarketsEnum(str, Enum):
    equity = "equity"
    option = "option"
    bond = "bond"
    future = "future"
    forex = "forex"
    
class MarketIDEnum(str, Enum):
    equity = "equity"
    option = "option"
    bond = "bond"
    future = "future"
    forex = "forex"
    
class ProjectionEnum(str, Enum):
    symbol_search = "symbol-search"
    symbol_regex = "symbol-regex"
    desc_search = "desc-search"
    desc_regex = "desc-regex"
    search = "search"
    fundamental = "fundamental"
    
class ExpMonthEnum(str, Enum):
    JAN = "JAN"
    FEB = "FEB"
    MAR = "MAR"
    APR = "APR"
    MAY = "MAY"
    JUN = "JUN"
    JUL = "JUL"
    AUG = "AUG"
    SEP = "SEP"
    OCT = "OCT"
    NOV = "NOV"
    DEC = "DEC"
    ALL = "ALL"
    
class TradingAccountTypeEnum(str, Enum):
    SCHWAB = "SCHWAB"
    TASTYTRADER = "TASTYTRADER"
    TRADIER = "TRADIER"

# class SessionEnum(str, Enum):
#     NORMAL = "NORMAL"
#     AM = "AM"
#     PM = "PM"
#     SEAMLESS = "SEAMLESS"  # example value

# class DurationEnum(str, Enum):
#     DAY = "DAY"
#     GOOD_TILL_CANCEL = "GOOD_TILL_CANCEL"
#     FILL_OR_KILL = "FILL_OR_KILL"
#     IMMEDIATE_OR_CANCEL = "IMMEDIATE_OR_CANCEL"
#     END_OF_WEEK = "END_OF_WEEK"
#     END_OF_MONTH = "END_OF_MONTH"
#     NEXT_END_OF_MONTH = "NEXT_END_OF_MONTH"
#     UNKNOWN = "UNKNOWN"
    
# class OrderTypeEnum(str, Enum):
#     MARKET = "MARKET"
#     LIMIT = "LIMIT"
#     STOP = "STOP"
#     STOP_LIMIT = "STOP_LIMIT"
#     TRAILING_STOP = "TRAILING_STOP"
#     CABINET = "CABINET"
#     NON_MARKETABLE = "NON_MARKETABLE"
#     MARKET_ON_CLOSE = "MARKET_ON_CLOSE"
#     EXERCISE = "EXERCISE"
#     TRAILING_STOP_LIMIT = "TRAILING_STOP_LIMIT"
#     NET_DEBIT = "NET_DEBIT"
#     NET_CREDIT = "NET_CREDIT"
#     NET_ZERO = "NET_ZERO"
#     LIMIT_ON_CLOSE = "LIMIT_ON_CLOSE"
#     UNKNOWN = "UNKNOWN"

    
