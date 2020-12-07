/**
 * @param {string} S
 * @return {number}
 */
var countPalindromicSubsequences = function(S) {
    let dp = []
    let n = S.length
    let arr = Array.from(S)

    for(let i=0; i<n; i++) {
        dp[i] = []
        for(let j=0; j<n;j++) {
            dp[i].push(0)
        }
        dp[i][i] = 1
    }

    //利用前面的回文子串来进行处理
    for(let size=2; size<n+1; size++) {
        for(let i=0; i<n-(size-1);i++) {
            let j = i+size-1
            if(arr[i]!=arr[j]) {
                dp[i][j] = dp[i+1][j]+dp[i][j-1]-dp[i+1][j-1]
            } else {
                dp[i][j] = 2 * dp[i+1][j-1]

                let l = i+1, r = j-1;
                while(arr[l] != arr[i] && l<=r) {l++}
                while(arr[r] != arr[i] && l<=r) {r--}

                if(l==r) {dp[i][j] += 1}
                else if(l>r) {dp[i][j] += 2}
                else {dp[i][j] -= dp[l+1][r-1]}
            }

            dp[i][j] %= 1000000007
            
        }
    }

    return dp[0][n - 1];
};



console.log(countPalindromicSubsequences("bccb"))