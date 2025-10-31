# Role Assignment Bug Fix Summary

## Problem Identified
When running `npm run seed`, all researchers were being created with the **LIDER** role instead of their specified roles (SUPER, ADMIN, LIDER, INVESTIGADOR).

## Root Cause
The `scripts/seed.js` file was defining **duplicate Mongoose schemas** that didn't match the real models:

```javascript
// ❌ BEFORE (WRONG - Duplicate Schema)
const ResearcherSchema = new mongoose.Schema({
    role: {  // ❌ Singular, with default
        type: String,
        default: 'LIDER'  // ❌ This was forcing all to be LIDER!
    }
    // ...
});
```

The real model uses:
```javascript
// ✅ REAL MODEL (researcher.model.js)
roles: [  // ✅ Plural, array of objects
    {
        role: String,
        start_date: Date,
        end_date: Date,
        active: Boolean
    }
]
```

## Solution Applied

### 1. **Completely Rewrote `scripts/seed.js`**
   - ✅ Now **imports REAL models** instead of defining duplicates
   - ✅ Uses proper `roles` array structure
   - ✅ Uses `createRole()` helper function (matching researcher.helper.js)
   - ✅ Creates diverse researchers with different roles

```javascript
// ✅ AFTER (CORRECT)
import Researcher from '../models/researcher.model.js';  // Use real model

const createRole = (role, startDate, endDate = null) => {
    return {
        role: role.toUpperCase(),
        start_date: startDate || new Date(),
        end_date: endDate,
        active: true
    };
};

const researchers = await Researcher.insertMany([
    {
        name: 'SUPER ADMINISTRADOR SENA',
        document_number: '99999999',
        roles: [createRole('SUPER', new Date('2020-01-01'))], // ✅ SUPER role
        // ...
    },
    {
        name: 'CARLOS ANDRÉS MARTÍNEZ',
        document_number: '11111111',
        roles: [createRole('ADMIN', new Date('2020-03-01'))], // ✅ ADMIN role
        // ...
    },
    {
        name: 'DR. JUAN PABLO HERNÁNDEZ',
        document_number: '33333333',
        roles: [createRole('LIDER', new Date('2021-02-01'))], // ✅ LIDER role
        // ...
    },
    {
        name: 'ING. LAURA VÁSQUEZ DÍAZ',
        document_number: '44444444',
        roles: [createRole('INVESTIGADOR', new Date('2022-03-01'))], // ✅ INVESTIGADOR role
        // ...
    }
]);
```

### 2. **Enhanced `controllers/researcher.controller.js`**
   - ✅ Now accepts `roles` parameter in request body
   - ✅ Validates roles against valid list: ['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR']
   - ✅ Supports both string format (`"LIDER"`) and object format (`{role: "LIDER", start_date: "..."}`)
   - ✅ Defaults to `INVESTIGADOR` if not specified

```javascript
// ✅ Enhanced saveResearcher function
researcherCtrl.saveResearcher = async (req, res) => {
    const {
        // ... other fields
        roles  // ✅ Now accepts roles from body
    } = req.body;

    // Process and validate roles
    let researcherRoles = [createRole('INVESTIGADOR', new Date())];

    if (roles && Array.isArray(roles) && roles.length > 0) {
        const validRoles = ['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR'];
        researcherRoles = roles.map(roleData => {
            const roleName = typeof roleData === 'string' ? roleData : roleData.role;
            const roleUpper = formatRole(roleName);

            if (!validRoles.includes(roleUpper)) {
                throw new Error(`Rol inválido: ${roleName}. Roles válidos: ${validRoles.join(', ')}`);
            }

            return createRole(roleUpper, roleData.start_date || new Date(), roleData.end_date || null);
        });
    }

    const researcher = new researcherModels({
        // ... other fields
        roles: researcherRoles  // ✅ Uses processed roles
    });
};
```

### 3. **Updated `package.json`**
```json
{
  "scripts": {
    "seed": "node ./scripts/seed.js"  // ✅ Simplified
  }
}
```

## Test Credentials Created
When you run the seed script, these researchers will be created:

| Role          | Document Number | Email                      | Password    |
|---------------|-----------------|----------------------------|-------------|
| SUPER         | 99999999        | super@sena.edu.co          | password123 |
| ADMIN         | 11111111        | admin@sena.edu.co          | password123 |
| LIDER         | 33333333        | lider@sena.edu.co          | password123 |
| INVESTIGADOR  | 44444444        | investigador@sena.edu.co   | password123 |
| INVESTIGADOR  | 55555555        | maria.lopez@sena.edu.co    | password123 |
| INVESTIGADOR  | 66666666        | andres.torres@sena.edu.co  | password123 |

## How to Test (In Your Local Environment)

### 1. **Run the Seed Script**
```bash
npm run seed
```

### 2. **Verify Roles in Database**
Connect to MongoDB and check the researchers collection:

```javascript
// MongoDB Query
db.researchers.find({}, {
    name: 1,
    document_number: 1,
    roles: 1
}).pretty()
```

**Expected Result:**
```javascript
[
    {
        "_id": "...",
        "name": "SUPER ADMINISTRADOR SENA",
        "document_number": "99999999",
        "roles": [
            {
                "role": "SUPER",
                "start_date": "2020-01-01T00:00:00.000Z",
                "end_date": null,
                "active": true
            }
        ]
    },
    {
        "_id": "...",
        "name": "CARLOS ANDRÉS MARTÍNEZ",
        "document_number": "11111111",
        "roles": [
            {
                "role": "ADMIN",  // ✅ NOT "LIDER"!
                "start_date": "2020-03-01T00:00:00.000Z",
                "end_date": null,
                "active": true
            }
        ]
    },
    // ... etc
]
```

### 3. **Test Authentication with Different Roles**
Use the Postman collection (`SENA_Research_System_API_v2.postman_collection.json`) to test:

```bash
# Test SUPER role
POST /api/auth/login
{
    "document": "99999999",
    "password": "password123"
}

# Test ADMIN role
POST /api/auth/login
{
    "document": "11111111",
    "password": "password123"
}

# Test LIDER role
POST /api/auth/login
{
    "document": "33333333",
    "password": "password123"
}
```

### 4. **Verify Role-Based Access Control**
After login, use the token to access protected endpoints and verify that:
- ✅ SUPER can access everything
- ✅ ADMIN can manage resources but not system config
- ✅ LIDER can manage projects and seedbeds
- ✅ INVESTIGADOR has limited access

## Files Changed

1. **scripts/seed.js** - Completely rewritten (448 additions, 746 deletions)
2. **controllers/researcher.controller.js** - Enhanced with roles parameter
3. **package.json** - Updated seed script

## Commit Details
```
Commit: fix: correct role assignment bug in researcher creation
Branch: claude/backend-code-review-011CUeSkxHXHn1jrC1o2uSvz
```

## Additional Notes

### Why This Bug Happened
- The seed script was defining its own schemas instead of importing real models
- The duplicate schema had a `role` field (singular) with `default: 'LIDER'`
- Mongoose was using the default value, ignoring what we tried to set
- The real model uses `roles` (plural, array), so there was a mismatch

### Why the Fix Works
- Now imports and uses the actual model from `models/researcher.model.js`
- Uses the correct `roles` array structure
- Follows the same pattern as the real controller code
- No more duplicate schemas = no more mismatches

## Testing Checklist

- [ ] Run `npm run seed` successfully
- [ ] Verify researchers have correct roles in MongoDB
- [ ] Test login with each role type (SUPER, ADMIN, LIDER, INVESTIGADOR)
- [ ] Verify role-based access control works correctly
- [ ] Create new researcher via API with custom role
- [ ] Verify Postman collection works with updated endpoints

---

**Status:** ✅ Fixed and committed
**Ready for Testing:** Yes (in local environment with MongoDB access)
