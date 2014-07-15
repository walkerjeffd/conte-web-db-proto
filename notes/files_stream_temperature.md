Summary of Example Files for Stream Temperature Data
====================================================

Raw data provided by Kyle O'Neil (@Tom-Bombadil) via dropbox (streamTemperature folder)

Overall conclusions:  
- data stored in either excel, access, or csv files  
- datasets in excel or access could be exported to csv files  
- large inconsistencies in field names  
- most datasets have a table of values that references a SiteID defined in a separate table

## Massachusetts Data

```
agency: MA Dept. of Fish & Wildlife (FW)
filename: streamTemperature\rawData\MA\StreamTemperature MAFW 072912.mdb
format: Access Database
size: 293 mb
data tables: [{
        tablename: Temperature_MAFW_1Yr
        nrow: 1,077,334
        fields: [Site_ID, Event_ID, Date1, Time1, Temp__°C_, QAQC]
        period: 2008 - 2009
    },{
        tablename: Temperature_MAFW_3Yr
        nrow: 479,499
        fields: [Site_ID, Event_ID, Date1, Time1, Temp__°C_, QAQC]
        period: 2005 - 2007
    }]
metadata:
    site tables: MAFW_*Yr_Site
    event tables: MAFW_*Yr_Event
    qaqc: QAQC
```

## Maine Data

```
agency: ME Dept. of Marine Resources (DMR)
files: [ {
        filename: Downeast Mean Daily River Temp_DMRdill.csv
        format: csv
        fields: [DeploymentID, Drainage, StreamName, SiteCode, HUC12, UTMeast, UTMnorth, Date, MeanDailyTemp]
        nrow: 84725
        period: 1991-06-05 - 2013-12-03
        metadata: [{
                filename: DMRLoggerLatLong.csv
                format: csv
                fields: ID, DeploymentID, Longitude, Latitude
                nrow: 550
                notes: lat/lon for each deployment
            }, {
                filename: DMRLoggerLatLong_CoastalSites.csv
                format: csv
                fields: FID_, site, Latitude, Longitude
                nrow: 12
                notes: lat/lon for coastal sites, not sure if this goes with this dataset
            }]
        notes: exported from "Downeast Mean Daily Temp_DMRdill_JW.accdb"
    }, {
        filename: emac_watertemps3_DailyMean.csv
        format: csv
        fields: Month/Day, 1, 2, ..., 49
        period: 2011-10-01 - 2014-09-30
        nrow: 1098
        notes: daily mean temperature at each deployment(?)
        metadata:{
            filename: emac_watertemps3_SiteInfo.csv
            format: csv
            fields: ["New NSO","HUC 12","Map Symbol","Description","River km"," UTM X "," UTM Y ","X","Y","Deploy Date-Time","logger I.D.","Water Temp (C)","pH","Tethered","Flow","Habitat Type","Width (f)","Depth (f)","Pict Up","Pict Down","Pict Tether","Pict Other","Name"]
            nrow: 49,
            notes: station metadata for daily mean temperature data
        }
    }]
```

## Montana Data

```
agency: USGS Northern Rocky Mountain Science Center
files: [
    {
        filename: alchokhachy_sites_BOZEMAN.csv
        format: csv
        fields: [Stream, date, temp, jday, airt, daylength, precip, srad, swe, vpress, discharge]
        nrow: 12,806
        period: 1995-05-26 - 2012-12-31
        notes: daily water temp, air temp, precip, solar, swe, vapor pressure, discharge
    }, {
        filename: Breakpoint_CCE_MTUSGS.csv
        format: csv
        fields: [year, month, day, date, temp, site, airTemp, dOY]
        nrow: 261,008
        period: 1989-04-21 - 2012-12-30
        notes: daily water temp and air temp
    }
]
```