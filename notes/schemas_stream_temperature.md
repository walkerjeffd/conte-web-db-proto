Potential Schemas for Stream Temperature
========================================

## Field Names

Ideas for potential fields/element names

- datetime  
- site  
- qaqc flag  
- units  
- agency  
- statistic (e.g. mean, min, max, inst)  
- freq (e.g. da, hr, min)  
- source file  

## QAQC Checks

- value range: each value must be within a valid range (e.g. 0-25 degC)  
- date range: each datetime stamp must be within valid range (e.g. 1900-01-01 - today)
- duplicated dates: no duplicate dates by site  
- daily delta: maximum change between successive values or over time (e.g. 5 degC/day)  
- site exists: if storing site information in separate table, make sure it exists before adding data  
- valid values: make sure values are valid for enumerated fields (e.g statistic, freq, qaqc, flag, units)

## Other Considerations

- timezone information  
- missing value (e.g. NA or -9999)  

## Schemas

**Option 1**: individual objects containing all metadata

Store each dataset as a large array of objects with each object containing metadata as individual elements

Pros: easy translation from/to csv or tabular format

Cons: excessive repetition of metadata, large array might be hard to query

```
[ {datetime: YYYY-MM-DD HH:MM, value: ##.#, site: $$$, agency: $$$},
  {datetime: YYYY-MM-DD HH:MM, value: ##.#, site: $$$, agency: $$$},
  ...
]
```

**Option 2**: metadata fields, array of objects containing date and time

Store each dataset as an object containing individual metadata elements and an array of (datetime, value) objects

Pros: less duplication of metadata

Cons:

```
{
  site: $$$$,
  agency: $$$$,
  values: [ {datetime: YYYY-MM-DD HH:MM, value: ##.#},
            {datetime: YYYY-MM-DD HH:MM, value: ##.#},
            ...
          ]
}
```

**Option 3**: metadata object, array of objects each containing datetime and value elements

Store each dataset as an object containing a metadata object and an array of (datetime, value) objects

Pros: less duplication of metadata

Cons:

```
{
  metadata: {
    site: $$$$,
    agency: $$$$,
  },
  values: [ {datetime: YYYY-MM-DD HH:MM, value: ##.#},
            {datetime: YYYY-MM-DD HH:MM, value: ##.#},
            ...
          ]
}
```

**Option 4**: metadata object, datetime array, value array

Store each dataset as an object containing a metadata object, an array of datetime values, and an array of values

Pros: less duplication of metadata

Cons: may need to merge datetimes and values arrays for analysis, arrays may become out of sync (different lengths), harder to update

```
{
  metadata: {
    site: $$$$,
    agency: $$$$,
  },
  datetimes: [ YYYY-MM-DD HH:MM, YYYY-MM-DD HH:MM, ...],
  values: [ ##.#, ##.#, ...]
}
```

**Option 5**: metadata, datetime object, value array

Store each dataset as an object containing a metadata object, a datetime object, and an array of values. Datetime object stores the start and end date and information about the frequency

Pros: less duplication of metadata and datatime information

Cons: would need to generate datetime array for analysis/plotting, requires continuous array of values matching datetime info, might be harder to update

```
{
  metadata: {
    site: $$$$,
    agency: $$$$,
  },
  datetimes: {
    start: YYYY-MM-DD HH:MM,
    end: YYYY-MM-DD HH:MM,
    count: ###,
    freq: DA (or ### seconds)
  },
  values: [ ##.#, ##.#, ...]
}
```
