import React, { useState, useEffect } from "react";
// Services
import { backendService } from "services/backend";
// Material ui
import {
  TextField,
  MenuItem,
  FormGroup,
  Divider,
  Typography
} from "@material-ui/core/";

export default props => {
  const { organisationId, location, error } = props;
  const [locationState, setLocationState] = useState({
    isActive: organisationId ? true : false,
    locations: []
  });

  async function getLocations(orgId) {
    try {
      const results = await backendService.getLocationsOfOrg(orgId);
      if (!results) {
        throw new Error("EMPLOYERS CANT BE FOUND");
      }
      if (results.length) {
        setLocationState({
          isActive: true,
          locations: results
        });
      }
    } catch (err) {
      console.error("Caught: ", err);
    }
  }

  useEffect(() => {
    organisationId && getLocations(organisationId);
  }, [organisationId]);

  return (
    <FormGroup>
      <Divider />
      <Typography variant="h6" className={props.typographyStyle}>
        Locaties
      </Typography>
      <TextField
        select
        label="Kies locatie"
        name="location"
        value={location}
        error={error ? true : false}
        helperText={error}
        disabled={!locationState.isActive}
        onChange={e => props.locationSubmit(e.target.value)}
        margin="dense"
        fullWidth
      >
        {locationState.locations.map(loc => (
          <MenuItem key={loc._id} value={loc._id}>
            {loc.city}
          </MenuItem>
        ))}
      </TextField>
    </FormGroup>
  );
};
